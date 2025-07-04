import {
  Device,
  LatLng,
  OpticalCableData,
  OpticalCableMonitoringModel,
  OpticalCableMonitoringWaringQueryParam,
  OpticalCableMonitoringWaringState,
  OpticalCableMonitoringWarning,
} from '@/pages/home/OpticalCableMonitoring/typings';
import { request } from '@@/exports';
import SystemConst from '@/utils/const';


const headers = {
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNzhlN2MxYzMwZmQ0MjllYWJiYzJhOGNiZTQ4MmUyYiIsInVuaXF1ZV9uYW1lIjoiYWRtaW4iLCJuYW1laWQiOiI4MiIsIm5hbWUiOiLns7vnu5_nrqHnkIblkZgiLCJyb2xlaWRzIjoiWzQwMTA4OTI2ODE5MTMwMSw0MDM2MDQxODU0MTk4NDUsNDA0MTM0OTQxOTIxMzQ5LDQwNTIxNTAxNzQwMjQzN10iLCJtYW5hZ2VtZW50X29yZ2FuaXplX2lkcyI6IlsyNCwxMiwyMCwyMywyNywxMyw2LDcsOCw5LDIsMywxMSwyNSwyOCwyNiwyOSwzMCwzMSwzMiwzMywzNCwzNSwzNiwxLDM3XSIsImJyYW5jaF9pZCI6IjEiLCJuYmYiOjE3MzMzOTE0NjgsImV4cCI6MTczNDU5MTQ2OCwiaXNzIjoiZGVxaW5nIiwiYXVkIjoibWFuYWdlciJ9.39GE-dN4LKnrf6PwWuIMuuxRHwonIxuygB7WqGZSMA8',
};

const OpticalCableMonitoringService = {
  //获取主要机房和线路列表 主要线路数据
  getMainLineData: () =>
    request<OpticalCableMonitoringModel>(`/gis/?postType=75&routeId=0`, {
      method: 'GET',
    }).then((value: any) => {
      const result: OpticalCableMonitoringModel = {
        fiberLines: [],
        dataCenterPoints: [],
      };

      const value1 = value[0];
      const value2 = value[1];

      // 处理 dataCenterPoints
      value1.forEach((element1: any) => {
        const value4 = element1 as { [key: string]: string };
        const value5 = value4['coordinates'].split(',');
        result.dataCenterPoints.push({
          latitude: parseFloat(value5[1]),
          longitude: parseFloat(value5[0]),
        });
      });

      // 处理 fiberLines
      value2.forEach((element2: any) => {
        const linePoints: LatLng[] = [];
        element2.forEach((element22: any) => {
          const value4 = element22 as { [key: string]: string };
          const value5 = value4['coordinates'].split(',');
          linePoints.push({
            latitude: parseFloat(value5[1]),
            longitude: parseFloat(value5[0]),
          });
        });
        result.fiberLines.push(linePoints);
      });

      return result;
    }),

  //获取告警列表(无位置信息)
  getList: async (params: OpticalCableMonitoringWaringQueryParam) =>
    request<OpticalCableMonitoringWarning[]>(
      `/${SystemConst.API_BASE}/optical-cable-monitoring/alarms`,
      {
        method: 'GET',
        params,
        // headers: headers,
      },
    ),

  getOpticalCableMonitoringWaringModelList: async (
    params: OpticalCableMonitoringWaringQueryParam,
  ): Promise<OpticalCableMonitoringWarning[]> => {
    try {
      // 初始请求，获取警告列表
      const warnings = await OpticalCableMonitoringService.getList(params);

      // 使用 Promise.all 并行处理所有警告项的详细信息请求
      return await Promise.all(
        warnings.map(async (item) => {
          try {
            // 构建详细信息请求的 URL 和参数
            const detailsData: OpticalCableData = await request<OpticalCableData>(
              `/gis/?postType=80`,
              {
                params: {
                  serial: item.cableId,
                  length: item.distanceFromStartStation?.toString(),
                },
                // headers: headers,
              },
            );

            // 处理 faultPoint
            if (detailsData?.faultPoint) {
              item.faultPoint = {
                latitude: detailsData.faultPoint.lat,
                longitude: detailsData.faultPoint.lon,
              };
            }

            // 处理 faultPath0 和 faultPath1
            const faultPath0: LatLng[] | undefined = detailsData?.faultPath0?.map((e: any) => ({
              latitude: e.lat,
              longitude: e.lon,
            }));

            const faultPath1: LatLng[] | undefined = detailsData?.faultPath1?.map((e: any) => ({
              latitude: e.lat,
              longitude: e.lon,
            }));

            item.faultPath = [
              ...(faultPath0 ? [faultPath0] : []),
              ...(faultPath1 ? [faultPath1] : []),
            ];

            // 处理 faultInfo
            item.faultInfo = detailsData?.faultInfo;
          } catch (ex) {
            console.error(`获取光缆点位信息失败 (Cable ID: ${item.cableId}):`, ex);
            // 根据需求，您可以选择是否抛出错误或继续处理其他项
          }

          // 转换其他字段
          return {
            ...item,
            fiberCoreId: item.fiberCoreId ?? undefined,
            fiberCoreName: item.fiberCoreName,
            state:
              item.state === 1
                ? OpticalCableMonitoringWaringState.Cleared
                : OpticalCableMonitoringWaringState.NotCleared,
            createTime: item.createTime ? new Date(item.createTime) : undefined,
            clearedTime: item.clearedTime ? new Date(item.clearedTime) : undefined,
            // faultPath, faultPoint 和 faultInfo 已在上面处理
          };
        }),
      );
    } catch (error) {
      console.error('获取光缆监控警告列表失败:', error);
      return []; // 根据需求，可以返回空数组或抛出错误
    }
  },
  /**
   @param param 关键字查询
   */
  keywordSearch: async (param: { Text: string }) =>
    request<Device[]>(`/gis/?postType=2&branch=1&userId=82&layers=26,27,37,38,39,40,41&chaoqianAreaId=614419418062917`, {
      params: param,
      method: 'GET',
      headers: headers,
    }),
  //点位查询
  pointSearch: async (params: { lng: number; lat: number }) =>
    request<Device[]>(
      `/gis/?postType=3&branch=1&userId=82&zoomLevel=13&layers=26,27,37,38,39,40,41&chaoqianAreaId=614419418062917`,
      {
        params: params,
        method: 'GET',
        headers: headers,
      },
    ),

  // 模拟故障
  test: async (id: string) =>
    request(`/${SystemConst.API_BASE}/optical-cable-monitoring/test/${id}`, {
      method: 'GET',
    }),
};

export default OpticalCableMonitoringService;
