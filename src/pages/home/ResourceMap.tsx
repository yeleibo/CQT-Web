import address from '@/assets/home/address.svg';
import boxType from '@/assets/home/box_type.svg';
import time from '@/assets/home/time.svg';
import OpticalCableMonitoringService from '@/pages/home/OpticalCableMonitoring/services';
import { Device } from '@/pages/map/BoxTyping';
import GeoJsonService from '@/pages/map/GeoJsonService';
import CoordTransforms from '@/pages/map/map-tools/CoordinateTransform';
import { switchBaseLayer } from '@/pages/map/map-tools/MapLayersTyping';
import { flyToLocation, initViewer } from '@/pages/map/map-tools/MapUtils';
import ProjectService from '@/pages/project/ProjectService';
import { ProjectDto } from '@/pages/project/type';
import { useModel } from '@@/exports';
import { RightOutlined } from '@ant-design/icons';
import { Input, List, message } from 'antd';
import * as Cesium from 'cesium';
import { Viewer } from 'cesium';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * 资源地图组件属性接口
 */
interface ResourceMapProps {
  projectId: number | null;
}

/**
 * 搜索结果项属性接口
 */
interface SearchResultItemProps {
  device: Device;
  onClick: (device: Device) => void;
}

/**
 * 搜索组件属性接口
 */
interface SearchComponentProps {
  onSearch: (value: string) => void;
  loading: boolean;
  results: Device[];
  visible: boolean;
  onResultItemClick: (device: Device) => void;
}

/**
 * 根据设备类型获取对应的图标
 */
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

/**
 * 搜索结果项组件
 */
const SearchResultItem: React.FC<SearchResultItemProps> = ({ device, onClick }) => {
  return (
    <List.Item
      onClick={() => onClick(device)}
      style={{
        cursor: 'pointer',
        padding: '12px 16px',
        minHeight: '100px',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div style={{ width: '100%' }}>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: '16px',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <span>{device.name}</span>
          <RightOutlined style={{ color: '#999', fontSize: '16px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '3px' }}>
          <img
            src={boxType}
            alt="型号"
            style={{ marginRight: '10px', width: '16px', height: '16px' }}
          />
          <div style={{ fontSize: '13px', color: '#666', lineHeight: '20px', flex: 1 }}>
            {(device.attributes as any)?.['Model'] || '-'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '3px' }}>
          <img
            src={time}
            alt="时间"
            style={{ marginRight: '10px', width: '16px', height: '16px' }}
          />
          <div style={{ fontSize: '13px', color: '#666', lineHeight: '20px', flex: 1 }}>
            {(device.attributes as any)?.['Create Time'] || '-'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '3px' }}>
          <img
            src={address}
            alt="地址"
            style={{ marginRight: '10px', width: '16px', height: '16px' }}
          />
          <div
            style={{
              fontSize: '13px',
              color: '#666',
              lineHeight: '20px',
              flex: 1,
              wordBreak: 'break-word',
            }}
          >
            {(device.attributes as any)?.['Address'] || '-'}
          </div>
        </div>
      </div>
    </List.Item>
  );
};

/**
 * 搜索组件
 */
const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  loading,
  results,
  visible,
  onResultItemClick,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '400px',
        zIndex: 1000,
      }}
    >
      <Input.Search
        placeholder="输入关键词"
        allowClear
        onSearch={onSearch}
        loading={loading}
        size="large"
      />

      {visible && (
        <div
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            maxHeight: '400px',
            overflowY: 'auto',
            borderRadius: '4px',
            marginTop: '20px',
          }}
        >
          {(results.length > 0 || loading) && (
            <List
              size="small"
              dataSource={results}
              loading={loading}
              locale={{ emptyText: ' ' }}
              renderItem={(device) => (
                <SearchResultItem key={device.id} device={device} onClick={onResultItemClick} />
              )}
            />
          )}
        </div>
      )}
    </div>
  );
};

/**
 * 资源地图组件
 */
const ResourceMap: React.FC<ResourceMapProps> = ({ projectId }) => {
  // Refs
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewerInstance = useRef<Viewer | null>(null);
  const entitiesRef = useRef<Cesium.Entity[]>([]);
  const dataSourceRef = useRef<Cesium.GeoJsonDataSource | null>(null);
  const handlerRef = useRef<Cesium.ScreenSpaceEventHandler | null>(null);

  // 状态
  const { initialState } = useModel('@@initialState');
  const [projectData, setProjectData] = useState<ProjectDto | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Device[]>([]);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);

  /**
   * 清除地图上的实体
   */
  const clearEntities = useCallback(() => {
    if (!viewerInstance.current) return;

    entitiesRef.current.forEach((entity) => {
      if (entity && viewerInstance.current) {
        viewerInstance.current.entities.remove(entity);
      }
    });

    entitiesRef.current = [];
  }, []);

  /**
   * 处理点击点搜索
   */
  const handlePointSearch = useCallback(async (lng: number, lat: number) => {
    try {
      setSearchLoading(true);
      setSearchVisible(true);

      console.log(`正在搜索点击位置: 经度=${lng}, 纬度=${lat}`);
      const results = await OpticalCableMonitoringService.pointSearch({ lng, lat });

      setSearchResults(results);
      if (results.length === 0) {
        message.info('没有找到设备');
        // 如果存在标记，清除它
        if (viewerInstance.current?.entities.getById('localMarker')) {
          viewerInstance.current.entities.removeById('localMarker');
        }
      }
    } catch (error) {
      console.error('点位搜索失败:', error);
      message.error('点位搜索失败');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  /**
   * 处理关键词搜索
   */
  const handleSearch = useCallback(async (value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      setSearchVisible(false);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchVisible(true);
      const results = await OpticalCableMonitoringService.keywordSearch({ Text: value });
      setSearchResults(results);
    } catch (error) {
      console.error('搜索失败:', error);
      message.error('搜索设备失败');
    } finally {
      setSearchLoading(false);
    }
  }, []);

  /**
   * 处理点击搜索结果项
   */
  const handleClickSearchItem = useCallback((device: Device) => {
    if (!viewerInstance.current || !device.points || device.points.length === 0) return;

    // 获取当前相机高度
    const cameraHeight = viewerInstance.current.camera.positionCartographic.height;
    
    // 飞到设备位置
    const position = CoordTransforms.CartographicToCartesian3(
      device.points[0].lon,
      device.points[0].lat,
      cameraHeight,
    );

    flyToLocation({
      viewer: viewerInstance.current,
      position: position,
      showMark: true,
    });
  }, []);

  /**
   * 设置地图点击事件
   */
  const setupMapEvents = useCallback(() => {
    if (!viewerInstance.current) return;

    // 清除之前的处理器
    if (handlerRef.current) {
      handlerRef.current.destroy();
      handlerRef.current = null;
    }

    // 创建新的处理器
    try {
      const handler = new Cesium.ScreenSpaceEventHandler(viewerInstance.current.scene.canvas);

      handler.setInputAction((movement: { position: Cesium.Cartesian2 }) => {
        if (!viewerInstance.current) return;

        try {
          const pickedObject = viewerInstance.current.scene.pick(movement.position);
          if (pickedObject && pickedObject.id && pickedObject.id.properties) {
            const properties = pickedObject.id.properties;
            const props: { [key: string]: any } = {};
            properties.propertyNames.forEach((name: string | number) => {
              props[name] = properties[name].getValue(Cesium.JulianDate.now());
            });
            console.log('点击的要素属性：', props);
          } else {
            // 如果没有点击到实体，则获取点击位置的经纬度
            const cartesian = viewerInstance.current.scene.pickPosition(movement.position);
            if (cartesian) {
              const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
              const lng = Cesium.Math.toDegrees(cartographic.longitude);
              const lat = Cesium.Math.toDegrees(cartographic.latitude);

              handlePointSearch(lng, lat);
            }
          }
        } catch (error) {
          console.error('处理地图点击事件失败:', error);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      handlerRef.current = handler;
    } catch (error) {
      console.error('设置地图点击事件处理器失败:', error);
    }
  }, [handlePointSearch]);

  /**
   * 获取项目详细信息
   */
  const fetchProjectDetail = useCallback(async (id: number) => {
    if (!id) return;

    try {
      const data = await ProjectService.getProjectList({});
      const project = data.find((item: ProjectDto) => item.id === id);
      
      if (project) {
        setProjectData(project);
      } else {
        message.error('未找到项目数据');
      }
    } catch (e) {
      console.error('获取项目边界数据失败:', e);
      message.error('获取项目边界数据失败');
    }
  }, []);

  /**
   * 获取并显示项目的GeoJSON数据
   */
  const fetchAndDisplayGeoJson = useCallback(async (id: number) => {
    if (!viewerInstance.current || !id) return;

    try {
      // 清除之前的数据源
      if (dataSourceRef.current) {
        viewerInstance.current.dataSources.remove(dataSourceRef.current, true);
        dataSourceRef.current = null;
      }

      // 获取项目GeoJSON数据
      const geojsonData = await GeoJsonService.getGeoJsonOfProject(id);
      if (!geojsonData || !viewerInstance.current) return;

      // 创建并配置数据源
      const dataSource = await loadGeoJsonDataSource(geojsonData);
      if (!dataSource || !viewerInstance.current) return;

      // 添加到地图并保存引用
      await viewerInstance.current.dataSources.add(dataSource);
      dataSourceRef.current = dataSource;

      // 缩放到数据范围
      try {
        await viewerInstance.current.zoomTo(dataSource);
      } catch (error) {
        console.warn('无法自动缩放到数据源范围:', error);
      }
    } catch (error) {
      console.error('获取或显示项目GeoJSON数据失败:', error);
      message.error('获取或显示项目GeoJSON数据失败');
    }
  }, []);

  /**
   * 加载GeoJSON数据源并设置样式
   */
  const loadGeoJsonDataSource = useCallback(async (geojsonData: any): Promise<Cesium.GeoJsonDataSource | null> => {
    if (!viewerInstance.current) return null;
    
    try {
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
      const entityUpdates: (() => void)[] = [];
      
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        
        if (entity.position && entity.properties) {
          try {
            const typeProperty = entity.properties.getValue(Cesium.JulianDate.now());
            const type: string = typeProperty.type;
            
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
      
      // 批量执行更新
      entityUpdates.forEach(update => update());
      
      return dataSource;
    } catch (error) {
      console.error('加载GeoJSON数据源失败:', error);
      return null;
    }
  }, []);

  /**
   * 显示项目边界
   */
  const displayProjectBoundary = useCallback(() => {
    if (!viewerInstance.current || !projectData || !projectData.mapRangePoints) return;

    // 清除现有实体
    clearEntities();

    try {
      // 解析边界点数据
      let pointsData = projectData.mapRangePoints;
      if (typeof pointsData === 'string') {
        pointsData = JSON.parse(pointsData);
      }

      if (!Array.isArray(pointsData) || pointsData.length < 3) return;

      // 提取坐标并计算中心点
      const { positions, center, points } = processMapPoints(pointsData);
      
      // 绘制边界线
      drawBoundaryLine(positions);
      
      // 飞到中心点
      if (center && points.length > 0) {
        const height = projectData.mapHeight || 10000;
        flyToLocation({
          viewer: viewerInstance.current,
          position: CoordTransforms.CartographicToCartesian3(center.longitude, center.latitude, height),
        });
      }
    } catch (e) {
      console.error('显示项目边界失败:', e);
      message.error('显示项目边界失败');
    }
  }, [projectData, clearEntities]);

  /**
   * 处理地图点数据
   */
  const processMapPoints = useCallback((pointsData: any[]) => {
    const positions: number[] = [];
    let sumLon = 0, sumLat = 0;
    
    const points = pointsData.map((point: any) => {
      // 处理两种可能的数据格式
      const pointData = point.coordinates 
        ? { longitude: point.coordinates[0], latitude: point.coordinates[1] }
        : { longitude: point.longitude, latitude: point.latitude };
      
      positions.push(pointData.longitude, pointData.latitude);
      sumLon += pointData.longitude;
      sumLat += pointData.latitude;
      
      return pointData;
    });
    
    // 闭合多边形
    if (points.length > 0) {
      positions.push(points[0].longitude, points[0].latitude);
    }
    
    // 计算中心点
    const center = points.length > 0 
      ? { longitude: sumLon / points.length, latitude: sumLat / points.length }
      : null;
      
    return { positions, center, points };
  }, []);

  /**
   * 绘制边界线
   */
  const drawBoundaryLine = useCallback((positions: number[]) => {
    if (!viewerInstance.current || positions.length < 4) return;
    
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
    
    return addedEntity;
  }, []);

  /**
   * 初始化地图
   */
  const init = useCallback(async () => {
    if (!viewerRef.current || !initialState?.applicationConfig) return;
    
    try {
      viewerInstance.current = initViewer(viewerRef.current);
      switchBaseLayer(viewerInstance.current, 'GoogleSatellite');

      // 设置默认视角
      const { longitude, latitude, mapViewHeight } = initialState.applicationConfig;
      viewerInstance.current.camera.setView({
        destination: CoordTransforms.CartographicToCartesian3(longitude, latitude, mapViewHeight),
      });

      // 设置地图点击事件
      setupMapEvents();
    } catch (e) {
      console.error('初始化地图失败:', e);
      message.error('初始化地图失败');
    }
  }, [initialState, setupMapEvents]);

  /**
   * 清理资源函数
   */
  const cleanup = useCallback(() => {
    // 清除实体
    clearEntities();
    
    // 清除数据源
    if (dataSourceRef.current && viewerInstance.current) {
      viewerInstance.current.dataSources.remove(dataSourceRef.current);
      dataSourceRef.current = null;
    }
    
    // 清除事件处理器
    if (handlerRef.current) {
      handlerRef.current.destroy();
      handlerRef.current = null;
    }
    
    // 销毁viewer
    if (viewerInstance.current) {
      viewerInstance.current.destroy();
      viewerInstance.current = null;
    }
  }, [clearEntities]);

  // 初始化
  useEffect(() => {
    init();
    return cleanup;
  }, [init, cleanup]);

  // 当projectId变化时获取项目数据
  useEffect(() => {
    if (projectId) {
      // 并行请求数据
      Promise.all([
        fetchProjectDetail(projectId), 
        fetchAndDisplayGeoJson(projectId)
      ]).catch(error => {
        console.error('加载项目数据失败:', error);
      });
    } else {
      // 清理数据
      setProjectData(null);
      clearEntities();
      
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

  // 搜索组件props
  const searchComponentProps = useMemo<SearchComponentProps>(() => ({
    onSearch: handleSearch,
    loading: searchLoading,
    results: searchResults,
    visible: searchVisible,
    onResultItemClick: handleClickSearchItem,
  }), [handleSearch, searchLoading, searchResults, searchVisible, handleClickSearchItem]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={viewerRef} style={{ width: '100%', height: '100%' }} />
      <SearchComponent {...searchComponentProps} />
    </div>
  );
};

export default ResourceMap;
