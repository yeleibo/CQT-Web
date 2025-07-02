import GeoJsonService from '@/pages/map/GeoJsonService';
import CoordTransforms from '@/pages/map/map-tools/CoordinateTransform';
import { switchBaseLayer } from '@/pages/map/map-tools/MapLayersTyping';
import { flyToLocation, initViewer } from '@/pages/map/map-tools/MapUtils';
import ProjectService from '@/pages/project/ProjectService';
import { ProjectDto } from '@/pages/project/type';
import { useModel } from '@@/exports';
import * as Cesium from 'cesium';
import { Viewer } from 'cesium';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { message } from 'antd';

interface ResourceMapProps {
  projectId: number | null;
}

// 提取地图事件处理为自定义Hook
const useMapEvents = (viewer: Viewer | null) => {
  useEffect(() => {
    if (!viewer) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((movement: { position: Cesium.Cartesian2 }) => {
      const pickedObject = viewer.scene.pick(movement.position);
      if (pickedObject && pickedObject.id && pickedObject.id.properties) {
        const properties = pickedObject.id.properties;
        const props: { [key: string]: any } = {};
        properties.propertyNames.forEach((name: string | number) => {
          props[name] = properties[name].getValue(Cesium.JulianDate.now());
        });
        console.log('点击的要素属性：', props);
        // 这里可以处理点击事件，例如显示信息框等
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
    };
  }, [viewer]);
};

// 提取图标获取逻辑
const getPointIconByType = (type: string): string => {
  switch (type) {
    case 'XBox':
      return require('@/assets/map/box1.png');
    case 'FatBox':
      return require('@/assets/map/box2.png');
    case 'OLT':
      return require('@/assets/map/box3.png');
    default:
      return require('@/assets/map/local.png');
  }
};

const ResourceMap: React.FC<ResourceMapProps> = ({ projectId }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewerInstance = useRef<Viewer | null>(null);
  const { initialState } = useModel('@@initialState');
  const entitiesRef = useRef<Cesium.Entity[]>([]);
  const [projectData, setProjectData] = useState<ProjectDto | null>(null);
  const dataSourceRef = useRef<Cesium.GeoJsonDataSource | null>(null);

  // 使用自定义Hook处理地图事件
  useMapEvents(viewerInstance.current);

  // 获取项目详细信息（只用于获取地图边界）
  const fetchProjectDetail = useCallback(async (id: number) => {
    if (!id) return;

    try {
      const data = await ProjectService.getProjectList({});
      // 筛选data中id为传入id
      const project = data.find((item: ProjectDto) => item.id === id);
      if (data && project) {
        setProjectData(project);
      } else {
        message.error('未找到项目数据');
      }
    } catch (e) {
      const errorMsg = '获取项目边界数据失败';
      console.error(errorMsg, e);
      message.error(errorMsg);
    }
  }, []);

  // 获取并显示项目的GeoJSON数据
  const fetchAndDisplayGeoJson = useCallback(async (id: number) => {
    if (!viewerInstance.current || !id) return;

    try {
      // 清除之前的数据源
      if (dataSourceRef.current && viewerInstance.current) {
        viewerInstance.current.dataSources.remove(dataSourceRef.current, true);
        dataSourceRef.current = null;
      }

      // 获取项目GeoJSON数据
      const geojsonData = await GeoJsonService.getGeoJsonOfProject(id);

      if (viewerInstance.current && geojsonData) {
        // 创建数据源
        const dataSource = new Cesium.GeoJsonDataSource();

        // 加载GeoJSON数据
        await dataSource.load(geojsonData, {
          stroke: Cesium.Color.HOTPINK,
          fill: Cesium.Color.PINK.withAlpha(0.5),
          strokeWidth: 5,
          clampToGround: true,
        });

        // 处理实体样式
        const entities = dataSource.entities.values;

        // 使用批量处理优化性能
        const entityUpdates = [];

        for (let i = 0; i < entities.length; i++) {
          const entity = entities[i];

          // 检查是否为点实体
          if (entity.position && entity.properties) {
            try {
              // 获取类型属性
              const type:string = entity.properties.getValue('type').type;

              entityUpdates.push(() => {
                entity.billboard = new Cesium.BillboardGraphics({
                  image: getPointIconByType(type),
                  height: 35,
                  width: 35,
                  disableDepthTestDistance: Number.POSITIVE_INFINITY,
                  distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 80000),
                });
              });
            } catch (error) {
              console.error('设置实体样式错误:', error);
            }
          }
        }

        // 批量执行实体更新
        entityUpdates.forEach(update => update());

        // 添加数据源到查看器
        await viewerInstance.current.dataSources.add(dataSource);
        dataSourceRef.current = dataSource;

        // 尝试缩放到数据源范围
        try {
          await viewerInstance.current.zoomTo(dataSource);
        } catch (error) {
          console.warn('无法自动缩放到数据源范围:', error);
        }
      }
    } catch (error) {
      const errorMsg = '获取或显示项目GeoJSON数据失败';
      console.error(errorMsg, error);
      message.error(errorMsg);
    }
  }, []);

  // 显示项目边界
  const displayProjectBoundary = useCallback(() => {
    if (!viewerInstance.current || !projectData || !projectData.mapRangePoints) return;

    // 清除现有实体
    clearEntities();

    try {
      // 解析mapRangePoints
      let pointsData = projectData.mapRangePoints;

      if (typeof pointsData === 'string') {
        pointsData = JSON.parse(pointsData);
      }

      if (!Array.isArray(pointsData) || pointsData.length < 3) return;

      // 提取坐标
      const positions: number[] = [];
      const points = pointsData.map((point: any) => {
        // 处理两种可能的数据格式
        if (point.coordinates) {
          return { longitude: point.coordinates[0], latitude: point.coordinates[1] };
        } else {
          return { longitude: point.longitude, latitude: point.latitude };
        }
      });

      // 计算中心点
      let sumLon = 0,
        sumLat = 0;
      points.forEach((point) => {
        positions.push(point.longitude, point.latitude);
        sumLon += point.longitude;
        sumLat += point.latitude;
      });

      // 闭合多边形
      if (points.length > 0) {
        positions.push(points[0].longitude, points[0].latitude);
      }

      // 添加边界线
      const polylineEntity = new Cesium.Entity({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(positions),
          width: 3,
          material: Cesium.Color.fromCssColorString('#3aff24'),
          clampToGround: true,
        },
      });

      const addedEntity = viewerInstance.current.entities.add(polylineEntity);
      entitiesRef.current.push(addedEntity);

      // 飞到中心点
      if (points.length > 0) {
        const centerLon = sumLon / points.length;
        const centerLat = sumLat / points.length;
        const height = projectData.mapHeight || 10000;

        // 飞到位置
        flyToLocation({
          viewer: viewerInstance.current,
          position: CoordTransforms.CartographicToCartesian3(centerLon, centerLat, height),
        });
      }
    } catch (e) {
      console.error('显示项目边界失败:', e);
      message.error('显示项目边界失败');
    }
  }, [projectData]);

  // 清除实体
  const clearEntities = useCallback(() => {
    if (!viewerInstance.current) return;

    entitiesRef.current.forEach((entity) => {
      if (entity && viewerInstance.current) {
        viewerInstance.current.entities.remove(entity);
      }
    });

    entitiesRef.current = [];
  }, []);

  // 初始化地图
  const init = useCallback(async () => {
    if (viewerRef.current) {
      try {
        viewerInstance.current = initViewer(viewerRef.current);
        switchBaseLayer(viewerInstance.current, 'GoogleSatellite');

        // 设置默认视角
        viewerInstance.current.camera.setView({
          destination: CoordTransforms.CartographicToCartesian3(
            initialState!.applicationConfig!.longitude,
            initialState!.applicationConfig!.latitude,
            initialState!.applicationConfig!.mapViewHeight,
          ),
        });
      } catch (e) {
        console.error('初始化地图失败:', e);
        message.error('初始化地图失败');
      }
    }
  }, [initialState]);

  // 初始化
  useEffect(() => {
    init();
    return () => {
      clearEntities();
      // 清除数据源
      if (dataSourceRef.current && viewerInstance.current) {
        viewerInstance.current.dataSources.remove(dataSourceRef.current);
      }
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
      }
    };
  }, [init, clearEntities]);

  // 当projectId变化时获取项目数据
  useEffect(() => {
    if (projectId) {
      // 使用Promise.all并行请求数据
      Promise.all([
        fetchProjectDetail(projectId),
        fetchAndDisplayGeoJson(projectId)
      ]).catch(error => {
        console.error('加载项目数据失败:', error);
      });
    } else {
      setProjectData(null);
      clearEntities();
      // 清除数据源
      if (dataSourceRef.current && viewerInstance.current) {
        viewerInstance.current.dataSources.remove(dataSourceRef.current);
        dataSourceRef.current = null;
      }
    }
  }, [projectId, fetchProjectDetail, fetchAndDisplayGeoJson, clearEntities]);

  // 当项目数据变化时更新地图
  useEffect(() => {
    if (viewerInstance.current && projectData) {
      displayProjectBoundary();
    }
  }, [projectData, displayProjectBoundary]);

  return (
    <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default ResourceMap;
