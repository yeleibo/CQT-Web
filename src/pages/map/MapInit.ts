// utils/initializeViewer.ts
import { MapLayer } from '@/pages/map/MapLayersTyping';
import * as Cesium from 'cesium';
import { Cartesian3, Viewer } from 'cesium';

export const initViewer = (
  containerId: string,
  baseMapLayer: MapLayer,
  onInitialized: (viewer: Viewer) => void,
) => {
  const viewer = new Viewer(containerId, {
    animation: false, //是否创建动画小器件，左下角仪表
    baseLayerPicker: false, //是否显示图层选择器
    fullscreenButton: false, //是否显示全屏按钮
    geocoder: false, //是否显示geocoder小器件，右上角查询按钮
    homeButton: false, //是否显示Home按钮
    infoBox: false, //是否显示信息框
    sceneModePicker: false, //是否显示3D/2D选择器
    selectionIndicator: false, //是否显示选取指示器组件
    timeline: false, //是否显示时间轴
    navigationHelpButton: false, //是否显示右上角的帮助按钮
    scene3DOnly: false, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    sceneMode: Cesium.SceneMode.SCENE3D, //初始场景模式
    fullscreenElement: document.body, //全屏时渲染的HTML元素,
  });

  viewer.imageryLayers.removeAll();
  viewer.imageryLayers.addImageryProvider(baseMapLayer.imageryProvider);
  //地图平移
  viewer.scene.screenSpaceCameraController.enableTranslate = true;
  viewer.scene.screenSpaceCameraController.enableLook = false;
  //抗锯齿
  viewer.scene.postProcessStages.fxaa.enabled = true;
  // viewer.scene.msaaSamples = 2;
  //场景默认视图-亚洲
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(90, -20, 110, 90);
  //相机视角
  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(115.58, 28.85, 12000),
  });
  onInitialized(viewer);
};
