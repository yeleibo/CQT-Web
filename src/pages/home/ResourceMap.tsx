import { useModel } from '@@/exports';
import { Cartesian3, Viewer, WebMapServiceImageryProvider } from 'cesium';
import React, { useEffect, useRef, useState } from 'react';
import { flyToLocation, initViewer, MapEffects } from '@/pages/map/map-tools/MapUtils';
import { switchBaseLayer } from '@/pages/map/map-tools/MapLayersTyping';
import CoordTransforms from '@/pages/map/map-tools/CoordinateTransform';
import { ProjectDto } from '@/pages/project/type';
import * as Cesium from 'cesium';
import ProjectService from '@/pages/project/ProjectService';

interface ResourceMapProps {
  projectId: number | null;
}

const ResourceMap: React.FC<ResourceMapProps> = ({ projectId }) => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewerInstance = useRef<Viewer | null>(null);
  const { initialState } = useModel('@@initialState');
  const entitiesRef = useRef<Cesium.Entity[]>([]);
  const [projectData, setProjectData] = useState<ProjectDto | null>(null);

  // 获取项目详细信息（只用于获取地图边界）
  const fetchProjectDetail = async (id: number) => {
    if (!id) return;

    try {

      const data = await ProjectService.getProjectList({});
      // 筛选data中id为传入id
      const project = data.find((item: ProjectDto) => item.id === id);
      if (data) {
        setProjectData(project);
      }
    } catch (e) {
      console.error('获取项目边界数据失败:', e);
    }
  };

  // 显示项目边界
  const displayProjectBoundary = () => {
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
      let sumLon = 0, sumLat = 0;
      points.forEach(point => {
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
          clampToGround: true
        }
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
          position: CoordTransforms.CartographicToCartesian3(
            centerLon, centerLat, height
          ),
        });
      }
    } catch (e) {
      console.error('显示项目边界失败:', e);
    }
  };

  // 清除实体
  const clearEntities = () => {
    if (!viewerInstance.current) return;

    entitiesRef.current.forEach(entity => {
      if (entity && viewerInstance.current) {
        viewerInstance.current.entities.remove(entity);
      }
    });

    entitiesRef.current = [];
  };

  const init = async () => {
    if (viewerRef.current) {
      try {
        // 创建一个简单的DIV并使用原生的Cesium API初始化
        viewerInstance.current = new Cesium.Viewer(viewerRef.current, {
          animation: false,
          baseLayerPicker: false,
          fullscreenButton: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          sceneModePicker: false,
          selectionIndicator: false,
          timeline: false,
          navigationHelpButton: false,
          scene3DOnly: false,
        });

        // 取消显示左下角版权信息
        (viewerInstance.current.cesiumWidget.creditContainer as HTMLElement).style.display = 'none';

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
      }
    }
  };

  // 初始化
  useEffect(() => {
    init();
    return () => {
      clearEntities();
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
      }
    };
  }, []);

  // 当projectId变化时获取项目数据
  useEffect(() => {
    if (projectId) {
      fetchProjectDetail(projectId);
    } else {
      setProjectData(null);
      clearEntities();
    }
  }, [projectId]);

  // 当项目数据变化时更新地图
  useEffect(() => {
    if (viewerInstance.current && projectData) {
      displayProjectBoundary();
    }
  }, [projectData]);

  return (
    <>
      <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
    </>
  );
};

export default ResourceMap;
