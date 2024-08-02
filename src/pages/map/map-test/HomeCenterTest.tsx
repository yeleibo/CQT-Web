// import { BaseImageryProvider } from '@/pages/map/ImageryProvider';
// import { EnvironmentTwoTone } from '@ant-design/icons';
// import { Button, Modal, Radio } from 'antd';
// import {
//   BoundingSphere,
//   Cartesian3,
//   Viewer as CesiumViewer,
//   Entity,
//   UrlTemplateImageryProvider,
//   Viewer,
// } from 'cesium';
// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
//
// const HomeCenter: React.FC = () => {
//   const imageryProvider = useMemo(() => new BaseImageryProvider(), []);
//   const [selectedLayerType, setSelectedLayerType] = useState('GoogleStandard');
//   const [selectedLayer, setSelectedLayer] = useState<UrlTemplateImageryProvider>(
//     imageryProvider.GoogleStandardProvider(),
//   );
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   // const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null);
//   const updateLayers = useCallback((viewer: CesiumViewer, layer: UrlTemplateImageryProvider) => {
//     viewer.imageryLayers.removeAll();
//     viewer.imageryLayers.addImageryProvider(layer);
//   }, []);
//
//   const viewerRef = useRef<null | Viewer>(null);
//   const viewerContainerRef = useRef(null);
//   //经纬度列表
//   const [latLng, setLatLng] = useState<latLng[]>([]);
//   //可撤销实体
//   const [undoEntity, setUndoEntity] = useState<Entity[]>([]);
//
//   useEffect(() => {
//     if (viewerContainerRef.current && !viewerRef.current) {
//       const v = new Viewer('csm-viewer-container', {
//         animation: false,
//         timeline: false,
//         geocoder: false,
//         fullscreenButton: false,
//         sceneModePicker: false,
//         navigationHelpButton: false,
//         homeButton: false,
//         baseLayerPicker: false,
//         navigationInstructionsInitiallyVisible: false,
//       });
//       viewerRef.current = v;
//     }
//   }, [viewerContainerRef]);
//
//   const handleLayerChange = useCallback(
//     (e: any) => {
//       const selectedValue = e.target.value;
//       setSelectedLayerType(selectedValue);
//       if (selectedValue === 'GoogleStandard') {
//         setSelectedLayer(imageryProvider.GoogleStandardProvider());
//       } else if (selectedValue === 'GoogleSatellite') {
//         setSelectedLayer(imageryProvider.GoogleSatelliteProvider());
//       }
//     },
//     [imageryProvider],
//   );
//
//   useEffect(() => {
//     const updateViewerLayers = () => {
//       if (viewerRef.current) {
//         const viewer = viewerRef.current;
//         viewer.camera.setView({ destination: Cartesian3.fromDegrees(115.58, 28.85, 12000) });
//         updateLayers(viewer, selectedLayer);
//       } else {
//         // Retry if cesiumElement is not yet available
//         setTimeout(updateViewerLayers, 100);
//       }
//     };
//
//     updateViewerLayers(); // Initial update
//
//     return () => {
//       if (viewerRef.current && viewerRef.current) {
//         const viewer = viewerRef.current;
//         viewer.imageryLayers.removeAll(); // Cleanup layers on unmount
//       }
//     };
//   }, [selectedLayer, updateLayers]);
//
//   const handleModalVisibility = (visible: boolean) => {
//     setIsModalVisible(visible);
//   };
//
//   const handleFlyToLocation = () => {
//     const viewer = viewerRef.current;
//     if (viewer) {
//       const target = Cartesian3.fromDegrees(115.58, 28.85, 12000);
//       const boundingSphere = new BoundingSphere(target, 5000);
//       viewer.camera.flyToBoundingSphere(boundingSphere);
//     }
//   };
//
//   //撤销实体
//   function undoLastEntity(): void {
//     const viewer = viewerRef.current;
//     if (viewer) {
//       if (undoEntity.length > 0) {
//         const newEntity = [...undoEntity];
//         const newLatLng = latLng.slice(0, latLng.length - 1);
//         const lastEntity = newEntity.pop()!;
//         setLatLng(newLatLng);
//         setUndoEntity(newEntity);
//         viewer.entities.remove(lastEntity);
//       }
//     }
//   }
//
//   //删除所有实体
//   function clearEntity(): void {
//     const viewer = viewerRef.current;
//     if (viewer) {
//       viewer.entities.removeAll();
//       setUndoEntity([]);
//       setLatLng([]);
//     }
//   }
//
//   return (
//     <div
//       id="csm-viewer-container"
//       ref={viewerContainerRef}
//       style={{ position: 'relative', height: '100%', overflow: 'hidden' }}
//     >
//       <div
//         style={{
//           position: 'absolute',
//           top: '10px',
//           right: '10px',
//           zIndex: 1000,
//         }}
//       >
//         <Button type="primary" onClick={() => handleModalVisibility(true)}>
//           切换图层
//         </Button>
//       </div>
//       <div
//         style={{
//           position: 'absolute',
//           top: '10px',
//           right: '10px',
//           zIndex: 1000,
//         }}
//       >
//         <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => markModalOpen(true)}>
//           标记模式
//         </Button>
//         {markModel ? (
//           <>
//             <Button type="primary" style={{ marginLeft: '10px' }} onClick={clearEntity}>
//               清除
//             </Button>
//             <Button type="primary" style={{ marginLeft: '10px' }} onClick={undoLastEntity}>
//               撤销
//             </Button>
//           </>
//         ) : (
//           <></>
//         )}
//       </div>
//       <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 1000 }}>
//         <Button
//           type="primary"
//           shape="circle"
//           icon={<EnvironmentTwoTone style={{ fontSize: '30px' }} />}
//           onClick={handleFlyToLocation}
//         />
//       </div>
//       <Modal
//         title="切换地图"
//         open={isModalVisible}
//         onOk={() => handleModalVisibility(false)}
//         onCancel={() => handleModalVisibility(false)}
//       >
//         <Radio.Group onChange={handleLayerChange} value={selectedLayerType}>
//           <Radio value="GoogleStandard">Google Standard</Radio>
//           <Radio value="GoogleSatellite">Google Satellite</Radio>
//         </Radio.Group>
//       </Modal>
//     </div>
//   );
// };
//
// export default HomeCenter;
