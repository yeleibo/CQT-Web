import { SpriteLineMaterial } from '@/pages/map/MapTools/CesiumMaterial';
import { MapLayer } from '@/pages/map/MapTools/MapLayersTyping';
import * as Cesium from 'cesium';
import { Cartesian3, Entity, Viewer } from 'cesium';

//初始化Viewer
export const initViewer = (
  containerId: string,
  baseMapLayer: MapLayer,
  onInitialized: (viewer: Viewer) => void,
) => {
  // 初始化 Viewer 实例
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
    sceneMode: Cesium.SceneMode.SCENE2D, //初始场景模式
    fullscreenElement: document.body, //全屏时渲染的HTML元素,
    //设置透明
    orderIndependentTranslucency: false,
    contextOptions: {
      webgl: {
        alpha: true,
      },
    },
  });
  // 取消显示左下角版权信息
  (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = 'none';

  // 设置场景背景为透明
  const { scene } = viewer;
  scene.backgroundColor = Cesium.Color.TRANSPARENT;
  scene.globe.baseColor = Cesium.Color.TRANSPARENT;

  //显示帧数
  scene.debugShowFramesPerSecond = true;

  // 清空并添加基础图层
  const { imageryLayers } = viewer;
  imageryLayers.removeAll();
  imageryLayers.addImageryProvider(baseMapLayer.imageryProvider);

  // 添加天地图图层（如果适用）
  if (baseMapLayer.type === 'tianditu') {
    imageryLayers.addImageryProvider(TianDiTuOtherMapLayer.imageryProvider);
  }

  // 启用地图平移，禁用相机 Look 操作
  const { screenSpaceCameraController } = scene;
  screenSpaceCameraController.enableTranslate = true;
  screenSpaceCameraController.enableLook = false;

  // 限制缩放级别
  screenSpaceCameraController.minimumZoomDistance = 500; // 最小缩放距离
  screenSpaceCameraController.maximumZoomDistance = 5000000; // 最大缩放距离

  // 启用抗锯齿效果
  scene.postProcessStages.fxaa.enabled = true;

  // 设置场景默认视图为亚洲区域
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(73.5, 18, 135, 53.5);

  // 回调函数，通知 Viewer 初始化完成
  onInitialized(viewer);
};

// CallbackProperty 是 Cesium 中的一种特殊属性类型，用于动态更新 Entity 的属性，
// 例如位置、方向等。它允许属性值随着时间变化而更新，非常适合处理实时数据或动画效果。
// positions: new CallbackProperty(() => {
//   return Cartesian3.fromDegreesArray(positionsArray);
// }, false),

//  distanceDisplayCondition 显示在距相机多少区间内是可以显示的
//  new Cesium.DistanceDisplayCondition(0, 1500),

//创建点
export const PointEntity = (options: {
  position: Cartesian3;
  id: string;
  name?: string;
  type?: string;
  pixelSize?: number;
  color?: Cesium.Color;
}): Entity => {
  const { position, id, name, type = 'point', pixelSize = 10, color = Cesium.Color.RED } = options;

  return new Entity({
    id: id,
    name: name,
    position: position,
    point: {
      pixelSize: pixelSize, // 点像素大小
      color: color, // 使用Cesium.Color
      //color: Cesium.Color.fromCssColorString('#ee0000'),
      outlineColor: Cesium.Color.WHITE, // 边框颜色
      outlineWidth: 2, // 边框宽度 (像素)
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),
    },
    properties: {
      type: type,
    },
  });
};

//创建线
export const PolylineEntity = (options: {
  positions: Cartesian3[];
  id: string;
  name?: string;
  type?: string;
  color?: Cesium.Color;
}): Entity => {
  const { positions, id, name, type = 'line', color = Cesium.Color.GREEN } = options;

  return new Entity({
    id: id,
    name: name,
    polyline: {
      positions: positions,
      width: 3,
      material: color,
    },
    properties: {
      type: type,
    },
  });
};

//创建广告牌
export const BillboardEntity = (options: {
  position: Cartesian3;
  id: string;
  name?: string;
  type?: string;
  image: string;
}): Entity => {
  const {
    position,
    id,
    name,
    type = 'billboard',
    image = require('@/assets/map/null.png'),
  } = options;
  return new Entity({
    id: id,
    name: name,
    position: position,
    billboard: {
      image: image,
      height: 35,
      width: 35,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 30000),
      disableDepthTestDistance: Number.POSITIVE_INFINITY, // 确保广告牌始终位于顶部
    },
    properties: {
      type: type,
    },
  });
};

//创建模型
export const ModelEntity = (options: {
  position: Cartesian3;
  id: string;
  name?: string;
  type?: string;
  model: string;
}): Entity => {
  const {
    position,
    id,
    name,
    type = 'model',
    model = require('../../../../public/models/OfficePlan.gltf'),
  } = options;

  return new Entity({
    id: id,
    name: name,
    position: position,
    model: {
      uri: model,
      minimumPixelSize: 50,
      maximumScale: 100,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 30000),
    },
    properties: {
      type: type,
    },
  });
};

//视角移动
export const flyToLocation = (options: {
  viewer: Viewer; // 传入 viewer 实例
  position: Cartesian3; // 可选的目标位置
  addMark?: boolean;
}) => {
  const { viewer, position, addMark = false } = options;
  const boundingSphere = new Cesium.BoundingSphere(position, 10000);

  viewer.camera.flyToBoundingSphere(boundingSphere, { duration: 1 });
  if (addMark) {
    viewer.entities.removeById('localMarker');
    const markEntity = BillboardEntity({
      position: position,
      id: 'localMarker',
      type: 'localMarker',
      image: require('@/assets/map/local.png'),
    });
    viewer.entities.add(markEntity);
  }
};

//道路特效
export const RoadShuttleEffects = (
  viewer: Viewer,
  line: Cartesian3[][],
  material?: Cesium.Material,
): Cesium.Primitive | null => {
  let primitive: Cesium.Primitive | null = null;
  if (viewer && viewer.scene) {
    const instance: Cesium.GeometryInstance[] = [];
    // 道路穿梭材质
    const lineMaterial = SpriteLineMaterial({});
    line.forEach((line) => {
      // 在光纤路径上创建流动效果
      const polyline = new Cesium.PolylineGeometry({
        positions: line,
        width: 5,
        vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
      });
      const geometry = Cesium.PolylineGeometry.createGeometry(polyline);
      // @ts-ignore
      instance.push(new Cesium.GeometryInstance({ geometry }));
    });

    const appearance = new Cesium.PolylineMaterialAppearance({
      material: material ?? lineMaterial,
    });

    primitive = new Cesium.Primitive({
      geometryInstances: instance,
      appearance,
      asynchronous: false,
    });
    viewer.scene.primitives.add(primitive);
  }
  return primitive;
};

//点位特效
export const PointEffects = (viewer: Viewer, points: Cartesian3[], material?: Cesium.Color) => {
  let r1 = 50; //指定扩散圆的最小半径，maxR为扩散圆的最大半径
  let r2 = 50;
  function changeR1() {
    //这是callback，参数不能内传
    r1 = r1 + 0.2; //deviationR为每次圆增加的大小
    if (r1 >= 500) {
      r1 = 20;
    }

    return r1;
  }

  function changeR2() {
    r2 = r2 + 0.2; //deviationR为每次圆增加的大小
    if (r2 >= 500) {
      r2 = 20;
    }
    return r2;
  }

  //添加点
  points.forEach((e) => {
    if (material === null) {
      viewer.entities.add({
        position: e,
        ellipse: {
          semiMinorAxis: new Cesium.CallbackProperty(changeR1, false),
          semiMajorAxis: new Cesium.CallbackProperty(changeR2, false),
          material: new Cesium.ImageMaterialProperty({
            image: require('@/assets/map/img.png'),
            repeat: new Cesium.Cartesian2(1.0, 1.0),
            transparent: true,
            color: new Cesium.CallbackProperty(function () {
              let alp = 1 - r1 / 800;
              return Cesium.Color.WHITE.withAlpha(alp); //entity的颜色透明 并不影响材质，并且 entity也会透明哦
            }, false),
          }),
        },
      });
    } else {
      viewer.entities.add({
        position: e,
        point: {
          pixelSize: 10, // 点像素大小
          color: material, // 使用Cesium.Color
          outlineColor: Cesium.Color.WHITE, // 边框颜色
          outlineWidth: 1, // 边框宽度 (像素)
        },
      });
    }
  });
};
