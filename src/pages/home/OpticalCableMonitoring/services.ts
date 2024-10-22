import {
  OpticalCableMonitoringModel,
  OpticalCableMonitoringWaringQueryParam,
  OpticalCableMonitoringWaringState,
  OpticalCableMonitoringWarning,
} from '@/pages/home/OpticalCableMonitoring/typings';
import { LatLng } from '@/pages/project/type';
import SystemConst from '@/utils/const';
import { request } from '@@/exports';

const OpticalCableMonitoringService = {
  getOpticalCableMonitoringModelList: () =>
    request<OpticalCableMonitoringModel>(`/api1/?postType=75&routeId=0`, {
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
  getOpticalCableMonitoringWaringModelList: async (
    params: OpticalCableMonitoringWaringQueryParam,
  ): Promise<OpticalCableMonitoringWarning[]> => {
    try {
      // 初始请求，获取警告列表
      const response = await request<OpticalCableMonitoringWarning[]>(
        `/api1/${SystemConst.API_BASE}/window/optical-cable-monitoring/alarms`,
        {
          method: 'GET',
          params,
          headers: {
            authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZTY2ODdjMjM4ODg0YmQ3OGE3NGE2ZDI3OGJlMTY4NSIsInVuaXF1ZV9uYW1lIjoiYWRtaW4iLCJuYW1laWQiOiI4MiIsIm5hbWUiOiLns7vnu5_nrqHnkIblkZgiLCJyb2xlaWRzIjoiWzQwMTA4OTI2ODE5MTMwMSw0MDM2MDQxODU0MTk4NDUsNDA0MTM0OTQxOTIxMzQ5LDQwNTIxNTAxNzQwMjQzN10iLCJtYW5hZ2VtZW50X29yZ2FuaXplX2lkcyI6IlsyNCwxMiwyMCwyMywyNywxMyw2LDcsOCw5LDIsMywxMSwyNSwyOCwyNiwyOSwzMCwzMSwzMiwzMywzNCwzNSwzNiwxLDM3XSIsImJyYW5jaF9pZCI6IjEiLCJuYmYiOjE3MjkyMzI0MTAsImV4cCI6MTczMDQzMjQxMCwiaXNzIjoiZGVxaW5nIiwiYXVkIjoibWFuYWdlciJ9.uLv_xrtzeztI9R2Rb6m4n76T-j3MIUfmEwD2Qm3m-ZY', // 同样推荐使用环境变量
          },
        },
      );

      const warnings = response;

      // 使用 Promise.all 并行处理所有警告项的详细信息请求
      const processedWarnings: OpticalCableMonitoringWarning[] = await Promise.all(
        warnings.map(async (item) => {
          try {
            // 构建详细信息请求的 URL 和参数
            const detailsResponse = await request<OpticalCableMonitoringWarning[]>(
              `/api1/?postType=80`,
              {
                params: {
                  serial: item.cableId,
                  length: item.distanceFromStartStation.toString(),
                },
                headers: {
                  authorization:
                    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlZTY2ODdjMjM4ODg0YmQ3OGE3NGE2ZDI3OGJlMTY4NSIsInVuaXF1ZV9uYW1lIjoiYWRtaW4iLCJuYW1laWQiOiI4MiIsIm5hbWUiOiLns7vnu5_nrqHnkIblkZgiLCJyb2xlaWRzIjoiWzQwMTA4OTI2ODE5MTMwMSw0MDM2MDQxODU0MTk4NDUsNDA0MTM0OTQxOTIxMzQ5LDQwNTIxNTAxNzQwMjQzN10iLCJtYW5hZ2VtZW50X29yZ2FuaXplX2lkcyI6IlsyNCwxMiwyMCwyMywyNywxMyw2LDcsOCw5LDIsMywxMSwyNSwyOCwyNiwyOSwzMCwzMSwzMiwzMywzNCwzNSwzNiwxLDM3XSIsImJyYW5jaF9pZCI6IjEiLCJuYmYiOjE3MjkyMzI0MTAsImV4cCI6MTczMDQzMjQxMCwiaXNzIjoiZGVxaW5nIiwiYXVkIjoibWFuYWdlciJ9.uLv_xrtzeztI9R2Rb6m4n76T-j3MIUfmEwD2Qm3m-ZY', // 同样推荐使用环境变量
                },
              },
            );

            const detailsData = detailsResponse;

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

      return processedWarnings;
    } catch (error) {
      console.error('获取光缆监控警告列表失败:', error);
      return []; // 根据需求，可以返回空数组或抛出错误
    }
  },
};

export default OpticalCableMonitoringService;
