import OpticalCableMonitoringService from '@/pages/home/OpticalCableMonitoring/services';
import { OtherMapLayers } from '@/pages/map/MapTools/MapLayersTyping';
import { createRoadEffects, initViewer } from '@/pages/map/MapTools/MapUtils';
import { Cartesian3, Viewer } from 'cesium';
import React, { useEffect, useRef } from 'react';
// @ts-ignore

const HomeCenter: React.FC = () => {
  const viewerRef = useRef<null | Viewer>(null);

  //初始化
  useEffect(() => {
    initViewer('home-viewer-container', OtherMapLayers.at(1)!, async (viewer) => {
      viewerRef.current = viewer;
      // 相机视角
      viewer.camera.setView({ destination: Cartesian3.fromDegrees(120.05, 30.56, 80000) });

      // 使用 OpticalCableMonitoringService 获取光缆监控模型数据并更新视图
      const opticalCableMonitoringModel =
        await OpticalCableMonitoringService.getOpticalCableMonitoringModelList();
      createRoadEffects(viewer, opticalCableMonitoringModel);
    });
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div id="home-viewer-container" style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};

export default HomeCenter;
