import { Button, Col, Drawer, Image, Row } from 'antd';
import * as Cesium from 'cesium';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MapLayer, switchBaseLayer } from '@/pages/map/map-tools/MapLayersTyping';

interface LayerDrawerProps {
  viewer: Cesium.Viewer;
  baseMapLayers: MapLayer[];
  extraLayers?: MapLayer[];
  onSelectExtraLayers?: (layer: MapLayer) => void;
}

// 图层项组件
const LayerItem: React.FC<{
  layer: MapLayer;
  isActive: boolean;
  onClick: () => void;
}> = ({ layer, isActive, onClick }) => {
  return (
    <Col key={layer.code} style={{ padding: '10px' }}>
      <div
        onClick={onClick}
        style={{
          width: '70px',
          height: '70px',
          border: isActive ? '2px solid blue' : '1px solid #f0f0f0',
          cursor: 'pointer',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <Image
          alt={layer.name}
          src={layer.imgSrc}
          preview={false}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div
        style={{
          marginTop: '10px',
          color: isActive ? 'blue' : 'black',
          textAlign: 'center',
        }}
      >
        {layer.name}
      </div>
    </Col>
  );
};

//地图切换抽屉
const MapLayersDrawer: React.FC<LayerDrawerProps> = ({
  viewer,
  baseMapLayers,
  extraLayers = [],
  onSelectExtraLayers,
}) => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<string>(baseMapLayers[0]?.code || '');
  const [selectedExtraLayers, setSelectedExtraLayers] = useState<MapLayer[]>([]);

  // 切换基础图层
  const handleChangeBaseMapLayer = useCallback(
    (layerCode: string) => {
      try {
        setCurrentLayer(layerCode);
        switchBaseLayer(viewer, layerCode);
      } catch (error) {
        console.error('切换基础图层失败:', error);
      }
    },
    [viewer],
  );

  // 选择/取消选择额外图层
  const handleSelectExtraLayer = useCallback(
    (layer: MapLayer) => {
      setSelectedExtraLayers((prev) => {
        const isSelected = prev.some((selected) => selected.code === layer.code);
        const updatedLayers = isSelected
          ? prev.filter((selected) => selected.code !== layer.code)
          : [...prev, layer];
        onSelectExtraLayers?.(layer);
        return updatedLayers;
      });
    },
    [onSelectExtraLayers],
  );

  // 切换Drawer的显示状态
  const toggleDrawer = useCallback(() => {
    setShowDrawer((prev) => !prev);
  }, []);

  const baseLayers = useMemo(() => baseMapLayers, [baseMapLayers]);

  const resourceLayers = useMemo(() => extraLayers, [extraLayers]);

  // 处理基础图层变化时的副作用
  useEffect(() => {
    if (viewer && currentLayer) {
      switchBaseLayer(viewer, currentLayer);
    }
  }, [currentLayer, viewer]);

  return (
    <>
      <div style={{ position: 'absolute', right: '30px', top: '10px', zIndex: 1000 }}>
        <Button type="primary" style={{ width: '50px', height: '50px' }} onClick={toggleDrawer}>
          图层
        </Button>
      </div>
      <Drawer
        title="图层"
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
        width={500}
        placement="right"
      >
        <section>
          <h3>地图类型</h3>
          <Row gutter={[16, 16]} style={{ justifyContent: 'space-around', padding: '10px' }}>
            {baseLayers.map((layer) => (
              <LayerItem
                key={layer.code}
                layer={layer}
                isActive={currentLayer === layer.code}
                onClick={() => handleChangeBaseMapLayer(layer.code)}
              />
            ))}
          </Row>
        </section>
        {resourceLayers.length > 0 && (
          <section>
            <h3>资源类型</h3>
            <Row gutter={[16, 16]} style={{ justifyContent: 'space-around', padding: '10px' }}>
              {resourceLayers.map((layer) => {
                const isSelected = selectedExtraLayers.some((e) => e.code === layer.code);
                return (
                  <LayerItem
                    key={layer.code}
                    layer={layer}
                    isActive={isSelected}
                    onClick={() => handleSelectExtraLayer(layer)}
                  />
                );
              })}
            </Row>
          </section>
        )}
      </Drawer>
    </>
  );
};

// 使用React.memo优化组件渲染
export default React.memo(MapLayersDrawer);
