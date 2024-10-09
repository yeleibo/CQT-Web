import { BaseMapLayers, MapLayer } from '@/pages/map/MapLayersTyping';
import { Button, Modal, Radio } from 'antd';
import * as cesium from 'cesium';
import { Cartesian3, Viewer as CesiumViewer, SceneMode, UrlTemplateImageryProvider } from 'cesium';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CesiumComponentRef, Viewer } from 'resium';

const HomeCenter: React.FC = () => {
  const [selectedLayerType, setSelectedLayerType] = useState('GoogleStandard');
  const [selectedLayer, setSelectedLayer] = useState<MapLayer>(BaseMapLayers.at(0)!);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null);

  const handleSelect = (layer: any) => {
    setSelectedLayer(layer.target.value);
  };

  const updateLayers = useCallback((viewer: CesiumViewer, layer: UrlTemplateImageryProvider) => {
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(layer);
  }, []);

  //改变底图
  const changeBaseMapLayer = useCallback((layer: MapLayer) => {
    if (viewerRef.current && viewerRef.current.cesiumElement) {
      viewerRef.current.cesiumElement.imageryLayers.removeAll();
      viewerRef.current.cesiumElement.imageryLayers.addImageryProvider(layer.imageryProvider);
    }
  }, []);

  useEffect(() => {
    const updateViewerLayers = () => {
      if (viewerRef.current && viewerRef.current.cesiumElement) {
        const viewer = viewerRef.current.cesiumElement;
        //2D
        viewer.scene.mode = SceneMode.SCENE2D;
        //地图平移
        viewer.scene.screenSpaceCameraController.enableTranslate = true;
        viewer.scene.screenSpaceCameraController.enableLook = false;
        //抗锯齿
        viewer.scene.postProcessStages.fxaa.enabled = true;
        // viewer.scene.msaaSamples = 2;
        //3D场景默认视图-亚洲
        cesium.Camera.DEFAULT_VIEW_RECTANGLE = cesium.Rectangle.fromDegrees(90, -20, 110, 90);
        //相机视角
        viewer.camera.setView({ destination: Cartesian3.fromDegrees(115.58, 28.85, 12000) });
        changeBaseMapLayer(selectedLayer);
      } else {
        setTimeout(updateViewerLayers, 1000);
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
        <Radio.Group onChange={handleSelect} value={selectedLayer}>
          {BaseMapLayers.map((option) => (
            <Radio key={option.code} value={option}>
              {option.name}
            </Radio>
          ))}
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default HomeCenter;
