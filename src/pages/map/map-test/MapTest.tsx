// import BoxInfo from '@/pages/map/BoxInfo';
// import {
//   boxTypes,
//   createImageEntity,
//   createPointEntity,
//   createPolylineEntity,
// } from '@/pages/map/EntityType';
// import { BaseMapLayers, MapLayer } from '@/pages/map/ImageryProvider';
// import { Box } from '@/pages/map/MapSearch';
// import { LatLng } from '@/pages/project/type';
// import { PageContainer } from '@ant-design/pro-components';
// import { Button, Col, Drawer, Image, Modal, Radio, Row } from 'antd';
// import * as Cesium from 'cesium';
// import {
//   BoundingSphere,
//   Cartesian3,
//   Entity,
//   ScreenSpaceEventHandler,
//   ScreenSpaceEventType,
//   Viewer,
// } from 'cesium';
// import React, { useCallback, useEffect, useRef, useState } from 'react';
//
// const Maps: React.FC = () => {
//   const viewerRef = useRef<null | Viewer>(null);
//   const viewerContainerRef = useRef(null);
//   //抽屉开关
//   const [showDrawer, setShowDrawer] = useState(false);
//   //选中的地图数据图层
//   const [otherMapLayers, setOtherMapLayers] = useState<string[]>([
//     'FatBox',
//     'SubBox',
//     'EndBox',
//     'HBox',
//   ]);
//   //选择的底图
//   const [baseMapLayer, setBaseMapLayer] = useState<MapLayer>(BaseMapLayers.at(0)!);
//   //改变底图
//   const changeBaseMapLayer = useCallback((layer: MapLayer) => {
//     if (viewerRef.current && !viewerRef.current.isDestroyed()) {
//       viewerRef.current.imageryLayers.removeAll();
//       viewerRef.current.imageryLayers.addImageryProvider(layer.imageryProvider);
//     }
//   }, []);
//   //地图数据图层
//   const changeOtherMapLayers = useCallback((boxType: string) => {
//     if (viewerRef.current) {
//       let entities = viewerRef.current.entities.values;
//       let x = entities.filter((e) => e.properties!.category.getValue() === boxType);
//       for (let i = 0; i < x.length; i++) {
//         let entity = x[i];
//         entity.show = !entity.show;
//       }
//     }
//   }, []);
//
//   //标记模式对话框
//   const [isShowMarkModel, setIsShowMarkModel] = useState(false);
//   //选中的标记模式
//   const [markModel, setMarkModel] = useState<number>(0);
//   const [markModelType, setMarkModelType] = useState<number>(0);
//   //信息
//   const [infoBox, setInfoBox] = useState<Box[]>([
//     new Box('1', 'HBox', { latitude: 28.84617039755671, longitude: 115.57507307892362 }, '1'),
//     new Box('2', 'FatBox', { latitude: 28.8623442715555, longitude: 115.57507307895555 }, '2'),
//     new Box('3', 'EndBox', { latitude: 28.855654706737884, longitude: 115.5642057678034 }, '3'),
//     new Box('4', 'SubBox', { latitude: 28.85482927541523, longitude: 115.58607307895555 }, '4'),
//   ]);
//   const [checkBox, setCheckBox] = useState<Box>();
//   //切换
//   const [openInfoBox, setOpenInfoBox] = useState(false);
//
//   //经纬度列表
//   const [latLngs, setLatLngs] = useState<LatLng[]>([]);
//
//   //可撤销实体
//   const [undoEntity, setUndoEntity] = useState<Entity[]>([]);
//
//   // 创建和初始化 Cesium.Viewer 实例的函数
//   const initializeViewer = useCallback(() => {
//     if (viewerContainerRef.current && !viewerRef.current) {
//       const v = new Viewer('csm-viewer-container', {
//         animation: false, //是否创建动画小器件，左下角仪表
//         baseLayerPicker: false, //是否显示图层选择器
//         fullscreenButton: false, //是否显示全屏按钮
//         geocoder: false, //是否显示geocoder小器件，右上角查询按钮
//         homeButton: false, //是否显示Home按钮
//         infoBox: false, //是否显示信息框
//         sceneModePicker: false, //是否显示3D/2D选择器
//         selectionIndicator: false, //是否显示选取指示器组件
//         timeline: false, //是否显示时间轴
//         navigationHelpButton: false, //是否显示右上角的帮助按钮
//         scene3DOnly: false, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
//         sceneMode: Cesium.SceneMode.SCENE2D, //初始场景模式
//         fullscreenElement: document.body, //全屏时渲染的HTML元素,
//       });
//       viewerRef.current = v;
//       changeBaseMapLayer(baseMapLayer);
//       //地图平移
//       viewerRef.current.scene.screenSpaceCameraController.enableTranslate = true;
//       viewerRef.current.scene.screenSpaceCameraController.enableLook = false;
//       //抗锯齿
//       viewerRef.current.scene.postProcessStages.fxaa.enabled = true;
//       // viewer.scene.msaaSamples = 2;
//       //3D场景默认视图-亚洲
//       Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(90, -20, 110, 90);
//       //相机视角
//       viewerRef.current.camera.setView({
//         destination: Cartesian3.fromDegrees(115.58, 28.85, 12000),
//       });
//     }
//   }, [baseMapLayer, changeBaseMapLayer]);
//
//   //初始化
//   useEffect(() => {
//     initializeViewer();
//     if (viewerRef.current) {
//       viewerRef.current.entities.suspendEvents();
//       infoBox.map((e) =>
//         viewerRef.current?.entities.add(
//           createImageEntity(
//             Cesium.Cartesian3.fromDegrees(
//               e.latLng.longitude,
//               e.latLng.latitude,
//               0,
//               Cesium.Ellipsoid.WGS84,
//             ),
//             e,
//           ),
//         ),
//       );
//       viewerRef.current.entities.resumeEvents();
//     }
//     return () => {
//       if (viewerRef.current) {
//         viewerRef.current.destroy();
//         viewerRef.current = null;
//       }
//     };
//   }, [initializeViewer]);
//
//   //标记操作
//   useEffect(() => {
//     const viewer = viewerRef.current;
//     if (viewer) {
//       const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
//
//       handler.setInputAction((event: any) => {
//         //屏幕坐标 转换为 笛卡尔空间直角坐标
//         let clickPosition = viewer.scene.camera.pickEllipsoid(event.position);
//         // 笛卡尔空间直角坐标 转换为 地理坐标（弧度制）
//         let radiansPos = Cesium.Cartographic.fromCartesian(clickPosition!);
//         //地理坐标（弧度制） 转换为 地理坐标（经纬度）
//         let newPoint = {
//           latitude: Cesium.Math.toDegrees(radiansPos.latitude),
//           longitude: Cesium.Math.toDegrees(radiansPos.longitude),
//         };
//         //点实体
//         const pointEntity = createPointEntity(clickPosition!);
//         let pick = viewer.scene.pick(event.position);
//
//         if (markModel === 1) {
//           viewer.entities.add(pointEntity);
//           setUndoEntity([pointEntity]);
//           setLatLngs([newPoint]);
//           let box = new Box('', markModel.toString(), newPoint, pointEntity.id);
//           setInfoBox((prev) => [...prev, box]);
//         } else if (markModel === 2) {
//           setLatLngs((prevLatLng) => {
//             const updatedLatLng = [...prevLatLng, newPoint];
//             if (updatedLatLng.length === 1) {
//               viewer.entities.add(pointEntity);
//               setUndoEntity([pointEntity]);
//               setLatLngs([newPoint]);
//             } else {
//               const polylineEntity = createPolylineEntity(updatedLatLng);
//               viewer.entities.add(polylineEntity);
//               setUndoEntity((prevEntity) => [...prevEntity, polylineEntity]);
//               let box = new Box('', markModel.toString(), newPoint, polylineEntity.id);
//               setInfoBox((prev) => [...prev, box]);
//             }
//             return updatedLatLng;
//           });
//         } else if (markModel === 3) {
//           // const billboardCollection = viewer.scene.primitives.add(new Cesium.BillboardCollection());
//           // const imageEntity = createImageEntity(clickPosition!);
//           // billboardCollection.add(imageEntity);
//           const imageEntity = createImageEntity(clickPosition!);
//           setLatLngs([newPoint]);
//           viewer.entities.add(imageEntity);
//           setUndoEntity((prevPoints) => [...prevPoints, imageEntity]);
//           let box = new Box('', markModel.toString(), newPoint, imageEntity.id);
//           setInfoBox((prev) => [...prev, box]);
//         } else {
//           if (Cesium.defined(pick)) {
//             setCheckBox(infoBox.find((e) => e.id === pick.id.id));
//             setOpenInfoBox(true);
//           }
//         }
//       }, ScreenSpaceEventType.LEFT_CLICK);
//
//       return () => {
//         handler.destroy();
//       };
//     }
//   }, [markModel, undoEntity]);
//
//   //撤销实体
//   function undoLastEntity(): void {
//     const viewer = viewerRef.current;
//     if (viewer) {
//       if (undoEntity.length > 0) {
//         const newEntity = [...undoEntity];
//         const newLatLng = latLngs.slice(0, latLngs.length - 1);
//         const lastEntity = newEntity.pop()!;
//         setLatLngs(newLatLng);
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
//       setLatLngs([]);
//     }
//   }
//
//   //抽屉开关
//   const DrawerToggle = (open: boolean) => {
//     setShowDrawer(open);
//   };
//
//   //标记模式选择开关
//   const markModalOpen = (open: boolean) => {
//     setIsShowMarkModel(open);
//   };
//   //标记模式选中处理
//   const markModalChange = useCallback((e: any) => {
//     setMarkModelType(e.target.value);
//   }, []);
//
//   const markModalOk = (visible: boolean) => {
//     setMarkModel(markModelType);
//     // setLatLngs([]);
//     // setUndoEntity([]);
//     markModalOpen(visible);
//   };
//   //回到指定区域
//   const flyToLocation = () => {
//     const viewer = viewerRef.current;
//     if (viewer) {
//       const target = Cartesian3.fromDegrees(115.58, 28.85, 12000);
//       const boundingSphere = new BoundingSphere(target, 5000);
//       viewer.camera.flyToBoundingSphere(boundingSphere);
//     }
//   };
//   //信息盒子
//   const BoxInfoOk = () => {
//     setOpenInfoBox(!openInfoBox);
//   };
//
//   const selectedTypes = (type: string) => {
//     if (!otherMapLayers.includes(type)) {
//       setOtherMapLayers((prev) => [...prev, type]);
//     } else {
//       const updatedLayers = otherMapLayers.filter((boxType) => boxType !== type);
//       // 更新状态
//       setOtherMapLayers(updatedLayers);
//     }
//     changeOtherMapLayers(type);
//   };
//
//   return (
//     <>
//       <PageContainer pageHeaderRender={false}>
//         <div
//           id="csm-viewer-container"
//           ref={viewerContainerRef}
//           style={{ width: '100%', height: '100%' }}
//         >
//           <div style={{ position: 'absolute', left: '10px', top: '10px', zIndex: 1000 }}>
//             <Button
//               type="primary"
//               style={{ width: '50px', height: '50px' }}
//               onClick={() => DrawerToggle(true)}
//             >
//               图层
//             </Button>
//           </div>
//           <div
//             style={{
//               position: 'absolute',
//               top: '10px',
//               right: '10px',
//               zIndex: 1000,
//             }}
//           >
//             <Button
//               type="primary"
//               style={{ marginLeft: '10px' }}
//               onClick={() => markModalOpen(true)}
//             >
//               标记模式
//             </Button>
//             {markModel ? (
//               <>
//                 <Button type="primary" style={{ marginLeft: '10px' }} onClick={clearEntity}>
//                   清除
//                 </Button>
//                 <Button type="primary" style={{ marginLeft: '10px' }} onClick={undoLastEntity}>
//                   撤销
//                 </Button>
//               </>
//             ) : (
//               <></>
//             )}
//           </div>
//           <Drawer title="图层" onClose={() => DrawerToggle(false)} open={showDrawer} width={500}>
//             <p>地图类型</p>
//             <Row gutter={16} style={{ justifyContent: 'space-around', padding: '10px' }}>
//               {BaseMapLayers.map((option) => (
//                 <Col key={option.code}>
//                   <div
//                     onClick={() => {
//                       setBaseMapLayer(option);
//                       changeBaseMapLayer(option);
//                     }}
//                     style={{
//                       width: '70px',
//                       height: '70px',
//                       border:
//                         baseMapLayer.code === option.code ? '2px solid blue' : '1px solid #f0f0f0',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     <Image
//                       alt={option.name}
//                       src={option.imgSrc}
//                       preview={false}
//                       draggable={false}
//                     />
//                   </div>
//                   <div
//                     style={{
//                       marginTop: '10px',
//                       color: baseMapLayer.code === option.code ? 'blue' : 'black',
//                       textAlign: 'center',
//                     }}
//                   >
//                     {option.name}
//                   </div>
//                 </Col>
//               ))}
//             </Row>
//             <p>资源类型</p>
//             <Row gutter={16} style={{ justifyContent: 'space-around', padding: '10px' }}>
//               {boxTypes.map((e) => (
//                 <Col key={e.name}>
//                   <div
//                     onClick={() => {
//                       selectedTypes(e.name);
//                     }}
//                     style={{
//                       width: '70px',
//                       height: '70px',
//                       border: otherMapLayers.includes(e.name)
//                         ? '2px solid blue'
//                         : '1px solid #f0f0f0',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     <Image alt={e.name} src={e.imgSrc} preview={false} draggable={false} />
//                   </div>
//                   <div
//                     style={{
//                       marginTop: '10px',
//                       color: otherMapLayers.includes(e.name) ? 'blue' : 'black',
//                       textAlign: 'center',
//                     }}
//                   >
//                     {e.name}
//                   </div>
//                 </Col>
//               ))}
//             </Row>
//           </Drawer>
//           <Modal
//             title="标记模式"
//             open={isShowMarkModel}
//             onOk={() => markModalOk(false)}
//             onCancel={() => markModalOpen(false)}
//             centered
//           >
//             <Radio.Group onChange={markModalChange} value={markModelType}>
//               <Radio value={1}>点</Radio>
//               <Radio value={2}>线</Radio>
//               <Radio value={3}>图片</Radio>
//               <Radio value={0}>无</Radio>
//             </Radio.Group>
//           </Modal>
//           {openInfoBox && (
//             <BoxInfo close={BoxInfoOk} model={'add'} data={checkBox} open={openInfoBox} />
//           )}
//         </div>
//       </PageContainer>
//     </>
//   );
// };
//
// export default Maps;
