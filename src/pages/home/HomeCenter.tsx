import { Cartesian3, Viewer as CesiumViewer, UrlTemplateImageryProvider } from 'cesium';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { CesiumComponentRef, Viewer } from 'resium';
import { MapImageryProvider } from '@/pages/map/ImageryProvider';
import { Button, Modal, Radio } from 'antd';

const HomeCenter: React.FC = () => {
  const imageryProvider = useMemo(() => new MapImageryProvider(), []);

  const [selectedLayerType, setSelectedLayerType] = useState('GoogleStandard');
  const [selectedLayer, setSelectedLayer] = useState<UrlTemplateImageryProvider>(
    imageryProvider.GoogleStandardProvider(),
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null);

  const updateLayers = useCallback((viewer: CesiumViewer, layer: UrlTemplateImageryProvider) => {
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(layer);
  }, []);

  const handleLayerChange = useCallback(
    (e: any) => {
      const selectedValue = e.target.value;
      setSelectedLayerType(selectedValue);
      if (selectedValue === 'GoogleStandard') {
        setSelectedLayer(imageryProvider.GoogleStandardProvider());
      } else if (selectedValue === 'GoogleSatellite') {
        setSelectedLayer(imageryProvider.GoogleSatelliteProvider());
      }
    },
    [imageryProvider],
  );

  useEffect(() => {
    const updateViewerLayers = () => {
      if (viewerRef.current && viewerRef.current.cesiumElement) {
        const viewer = viewerRef.current.cesiumElement;
        viewer.camera.setView({ destination: Cartesian3.fromDegrees(115.58, 28.85, 12000) });
        updateLayers(viewer, selectedLayer);
      } else {
        // Retry if cesiumElement is not yet available
        setTimeout(updateViewerLayers, 100);
      }
    };

    updateViewerLayers(); // Initial update

    return () => {
      if (viewerRef.current && viewerRef.current.cesiumElement) {
        const viewer = viewerRef.current.cesiumElement;
        viewer.imageryLayers.removeAll(); // Cleanup layers on unmount
      }
    };
  }, [selectedLayer, updateLayers]);

  const handleModalVisibility = (visible: boolean) => {
    setIsModalVisible(visible);
  };

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <Viewer
        full
        className="cesium-container"
        ref={viewerRef}
        infoBox={false}
        timeline={false}
        animation={false}
        fullscreenButton={false}
        homeButton={false}
        sceneModePicker={false}
        baseLayerPicker={false}
        navigationHelpButton={false}
        geocoder={false}
      >
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
          }}
        >
          <Button type="primary" onClick={() => handleModalVisibility(true)}>
            切换图层
          </Button>
        </div>
      </Viewer>
      <Modal
        title="切换地图"
        open={isModalVisible}
        onOk={() => handleModalVisibility(false)}
        onCancel={() => handleModalVisibility(false)}
      >
        <Radio.Group onChange={handleLayerChange} value={selectedLayerType}>
          <Radio value="GoogleStandard">Google Standard</Radio>
          <Radio value="GoogleSatellite">Google Satellite</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default HomeCenter;
