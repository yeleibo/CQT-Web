import GeoJsonService from '@/pages/map/GeoJsonService';
import { switchBaseLayer } from '@/pages/map/map-tools/MapLayersTyping';
import { Modal } from 'antd';
import * as Cesium from 'cesium';
import { Viewer } from 'cesium';
import React, { useEffect, useRef, useState } from 'react';
import { initViewer } from './map-tools/MapUtils';

interface FeatureProperties {
  [key: string]: any;
}

const Maps: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const viewerInstance = useRef<Viewer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [featureProps, setFeatureProps] = useState<FeatureProperties>({});

  // 根据类型获取图标
  const getPointIconByType = (type: number): string => {
    console.log('获取图标类型:', type);
    switch (type) {
      case 0:
        return require('@/assets/map/box1.png');
      case 1:
        return require('@/assets/map/box2.png');
      case 2:
        return require('@/assets/map/box3.png');
      default:
        return require('@/assets/map/local.png');
    }
  };

  //初始化
  useEffect(() => {
    if (viewerRef.current) {
      viewerInstance.current = initViewer(viewerRef.current);
      switchBaseLayer(viewerInstance.current, 'GoogleStandard');

      // 添加调试信息
      console.log('初始化地图开始加载数据...');

      GeoJsonService.getGeoJson()
        .then((geojsonData) => {
          if (viewerInstance.current && geojsonData) {
            console.log('GeoJSON数据加载成功:', geojsonData);

            // 创建数据源
            const dataSource = new Cesium.GeoJsonDataSource();

            // 手动加载GeoJSON数据
            dataSource
              .load(geojsonData, {
                stroke: Cesium.Color.HOTPINK,
                fill: Cesium.Color.PINK.withAlpha(0.5),
                strokeWidth: 5,
                clampToGround: true,
              })
              .then(() => {
                // 数据源加载完成后处理实体
                console.log('数据源加载完成，开始设置点样式...');

                // 获取所有实体
                const entities = dataSource.entities.values;
                console.log('实体总数:', entities.length);

                // 遍历实体设置样式
                for (let i = 0; i < entities.length; i++) {
                  const entity = entities[i];

                  // 检查是否为点实体
                  if (entity.position) {

                    // 获取属性（如果有）
                    if (entity.properties) {
                      try {
                        // 获取类型属性
                        const typeValue = entity.properties.type;
                        const type = typeValue ? typeValue.getValue(Cesium.JulianDate.now()) : 0;
                        console.log(`实体类型: ${type}`);

                        entity.billboard = new Cesium.BillboardGraphics({
                          image: getPointIconByType(type),
                          height: 35,
                          width: 35,
                          disableDepthTestDistance: Number.POSITIVE_INFINITY,
                          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 80000),
                        });
                      } catch (error) {
                        console.error('设置实体样式错误:', error);
                      }
                    }
                  }

                }

                // 添加数据源到查看器
                viewerInstance.current?.dataSources.add(dataSource);
                // 缩放到数据范围
                viewerInstance.current!.zoomTo(dataSource);
              })
              .catch((error) => {
                console.error('加载GeoJSON数据到数据源时出错:', error);
              });
          }
        })
        .catch((error) => {
          console.error('获取GeoJSON数据失败:', error);
        });
    }

    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
    };
  }, []);

  //点击
  useEffect(() => {
    const viewer = viewerInstance.current;
    if (viewer) {
      const handler = new Cesium.ScreenSpaceEventHandler(viewerInstance.current!.scene.canvas);
      handler.setInputAction(function (movement: { position: Cesium.Cartesian2 }) {
        const pickedObject = viewerInstance.current!.scene.pick(movement.position);
        if (pickedObject && pickedObject.id && pickedObject.id.properties) {
          const properties = pickedObject.id.properties;
          // 将 Cesium 的 PropertyBag 转换为普通 JS 对象（可选）
          const props: FeatureProperties = {};
          properties.propertyNames.forEach((name: string | number) => {
            props[name] = properties[name].getValue(Cesium.JulianDate.now());
          });
          console.log('点击的要素属性：', props);

          // 设置要素属性并打开Modal
          setFeatureProps(props);
          setIsModalOpen(true);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      return () => {
        handler.destroy();
      };
    }
  }, []);

  // 关闭Modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div ref={viewerRef} style={{ width: '100%', height: '100vh' }}>
        <div
          style={{
            position: 'absolute',
            left: '30px',
            height: '300px',
            width: '400px',
            top: '80px',
            zIndex: 1000,
          }}
        ></div>
      </div>

      {/* 属性信息Modal */}
      <Modal title="详细信息" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <div className="feature-properties">
          {Object.entries(featureProps).map(([key, value]) => (
            <p key={key}>
              <strong>{key}：</strong>
              {String(value)}
            </p>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default Maps;
