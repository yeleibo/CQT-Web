// components/LayerDrawer.tsx
import { boxImages, BoxType, DataType } from '@/pages/map/BoxTyping';
import { BaseMapLayers, MapLayer } from '@/pages/map/MapLayersTyping';
import { Col, Drawer, Image, Row } from 'antd';
import { Viewer } from 'cesium';
import React, { useCallback, useState } from 'react';

export const useBaseMapLayer = (initialLayer: MapLayer) => {
  const [baseMapLayer, setBaseMapLayer] = useState<MapLayer>(initialLayer);

  const changeBaseMapLayer = useCallback((layer: MapLayer, viewer: Viewer) => {
    if (viewer && !viewer.isDestroyed()) {
      viewer.imageryLayers.removeAll();
      viewer.imageryLayers.addImageryProvider(layer.imageryProvider);
    }
    setBaseMapLayer(layer);
  }, []);

  return { baseMapLayer, changeBaseMapLayer };
};

export const useOtherMapLayers = () => {
  const [showBoxType, setShowBoxType] = useState<BoxType[]>([
    BoxType.HBox,
    BoxType.FatBox,
    BoxType.EndBox,
    BoxType.SubBox,
  ]);

  const changeOtherMapLayers = useCallback((boxType: BoxType, viewer: Viewer) => {
    if (viewer && !viewer.isDestroyed()) {
      let entities = viewer.entities.values;
      const boxEntities = entities.filter((e) => e.properties?.type.getValue() === DataType.Box);

      boxEntities.forEach((entity) => {
        if (entity.properties!.boxType.getValue() === boxType) {
          entity.show = !entity.show;
        }
      });
    }
  }, []);

  const selectedTypes = useCallback(
    (type: BoxType, viewer: Viewer) => {
      setShowBoxType((prev) =>
        prev.includes(type) ? prev.filter((boxType) => boxType !== type) : [...prev, type],
      );
      changeOtherMapLayers(type, viewer);
    },
    [changeOtherMapLayers],
  );

  return { showBoxType, selectedTypes };
};

interface LayerDrawerProps {
  open: boolean;
  onClose: () => void;
  baseMapLayer: MapLayer;
  changeBaseMapLayer: (layer: MapLayer) => void;
  showBoxType: BoxType[];
  selectedBoxType: (boxType: BoxType) => void;
}

const MapDrawer: React.FC<LayerDrawerProps> = ({
  open,
  onClose,
  baseMapLayer,
  changeBaseMapLayer,
  showBoxType,
  selectedBoxType,
}) => (
  <Drawer title="图层" onClose={onClose} open={open} width={500}>
    <p>地图类型</p>
    <Row gutter={16} style={{ justifyContent: 'space-around', padding: '10px' }}>
      {BaseMapLayers.map((option) => (
        <Col key={option.code}>
          <div
            onClick={() => changeBaseMapLayer(option)}
            style={{
              width: '70px',
              height: '70px',
              border: baseMapLayer.code === option.code ? '2px solid blue' : '1px solid #f0f0f0',
              cursor: 'pointer',
            }}
          >
            <Image alt={option.name} src={option.imgSrc} preview={false} draggable={false} />
          </div>
          <div
            style={{
              marginTop: '10px',
              color: baseMapLayer.code === option.code ? 'blue' : 'black',
              textAlign: 'center',
            }}
          >
            {option.name}
          </div>
        </Col>
      ))}
    </Row>
    <p>资源类型</p>
    <Row gutter={16} style={{ justifyContent: 'space-around', padding: '10px' }}>
      {Object.values(BoxType).map((e) => (
        <Col key={e}>
          <div
            onClick={() => {
              selectedBoxType(e);
            }}
            style={{
              width: '70px',
              height: '70px',
              border: showBoxType.includes(e) ? '2px solid blue' : '1px solid #f0f0f0',
              cursor: 'pointer',
            }}
          >
            <Image alt={e} src={boxImages[e]} preview={false} draggable={false} />
          </div>
          <div
            style={{
              marginTop: '10px',
              color: showBoxType.includes(e) ? 'blue' : 'black',
              textAlign: 'center',
            }}
          >
            {e}
          </div>
        </Col>
      ))}
    </Row>
  </Drawer>
);

export default MapDrawer;
