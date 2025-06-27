import * as Cesium from 'cesium';
import { Cartesian3, Entity, Property, Viewer } from 'cesium';
import CoordTransforms from '@/pages/map/map-tools/CoordinateTransform';
import { SpriteLineMaterial } from '@/pages/map/map-tools/CesiumMaterial';
import { MapLayer } from './MapLayersTyping';

const viewerOptions = (is3D: boolean): Viewer.ConstructorOptions => ({
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
  sceneMode: is3D ? Cesium.SceneMode.SCENE3D : Cesium.SceneMode.SCENE2D, //初始场景模式
  fullscreenElement: document.body, //全屏时渲染的HTML元素,
  skyBox: false,
  //设置透明
  orderIndependentTranslucency: false,
  contextOptions: {
    webgl: {
      alpha: true,
    },
  },
});

//初始化Viewer
export const initViewer = (containerId: Element | string, is3D = false) => {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MDdmYjIzYy05NjNkLTQ0MGQtODllMy1mOWE3ZWZlZWNkNzYiLCJpZCI6MjM2OTIzLCJpYXQiOjE3MjQ2NDA2MjZ9.5Yxr-B0CmWyN91QV0Dz0mYtNd4DemAdR-PvX4tfhL6I';
  // 初始化 Viewer 实例
  const viewer = new Viewer(containerId, viewerOptions(is3D));

  // 取消显示左下角版权信息
  (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = 'none';

  // 设置场景背景为透明
  const { scene } = viewer;
  scene.backgroundColor = Cesium.Color.BLACK;
  scene.globe.baseColor = Cesium.Color.TRANSPARENT;

  //显示帧数,fps
  scene.debugShowFramesPerSecond = false;

  // 清空并添加基础图层
  const { imageryLayers } = viewer;
  imageryLayers.removeAll();

  // 启用地图平移，禁用相机 Look 操作
  const { screenSpaceCameraController } = scene;
  screenSpaceCameraController.enableTranslate = true;
  screenSpaceCameraController.enableLook = false;

  // 限制缩放级别
  screenSpaceCameraController.minimumZoomDistance = 1; // 最小缩放距离
  screenSpaceCameraController.maximumZoomDistance = 5000000; // 最大缩放距离

  // 启用抗锯齿效果
  scene.postProcessStages.fxaa.enabled = true;

  // 设置场景默认视图为亚洲区域
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(73.5, 18, 135, 53.5);

  return viewer;
};

// const tileset = viewer.scene.primitives.add(
//   await Cesium.Cesium3DTileset.fromIonAssetId(2275207),
// );

// CallbackProperty 是 Cesium 中的一种特殊属性类型，用于动态更新 Entity 的属性，
// 例如位置、方向等。它允许属性值随着时间变化而更新，非常适合处理实时数据或动画效果。
// positions: new CallbackProperty(() => {
//   return Cartesian3.fromDegreesArray(positionsArray);
// }, false),

//  distanceDisplayCondition 显示在距相机多少区间内是可以显示的
//  new Cesium.DistanceDisplayCondition(0, 1500),

//创建实体
export class CreateEntity {
  //创建点
  static PointEntity = (options: {
    position: Cartesian3;
    id: string;
    name?: string;
    type?: string;
    pixelSize?: number;
    color?: Property | undefined;
  }): Entity => {
    const {
      position,
      id,
      name,
      type = 'point',
      pixelSize = 10,
      color = Cesium.Color.RED,
    } = options;

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
  static PolylineEntity = (options: {
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
  static BillboardEntity = (options: {
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
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 80000),
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // 确保广告牌始终位于顶部
      },
      properties: {
        type: type,
      },
    });
  };

  //创建模型
  static ModelEntity = (options: {
    position: Cartesian3;
    id: string;
    name?: string;
    type?: string;
    model: string;
  }): Entity => {
    const { position, id, name, type = 'model', model } = options;

    return new Entity({
      id: id,
      name: name,
      position: position,
      model: {
        uri: model,
        scale: 2.0,
        minimumPixelSize: 20,
        maximumScale: 200,
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 50000),
      },
      properties: {
        type: type,
      },
    });
  };
}

//视角移动
export const flyToLocation = (options: {
  viewer: Viewer; // 传入 viewer 实例
  position: Cartesian3; // 可选的目标位置
  showMark?: boolean;
  orientation?: any;
}) => {
  const { viewer, position, orientation, showMark = false } = options;

  // 将 Cartesian3 转换为 Cartographic
  let x = CoordTransforms.Cartesian3ToCartographic(position);
  const cartographicPosition = Cesium.Cartographic.fromCartesian(position);

  const cameraHeight = viewer.camera.positionCartographic.height;
  console.log(
    '经度:',
    x.longitude,
    '纬度:',
    x.latitude,
    '高度:',
    x.height,
    '相机高度:',
    cameraHeight,
    cartographicPosition.height,
  );

  viewer.camera.flyTo({ destination: position, orientation: orientation, duration: 0.5 });

  //是否显示标记
  if (showMark) {
    viewer.entities.removeById('localMarker');
    const markEntity = CreateEntity.BillboardEntity({
      position: position,
      id: 'localMarker',
      type: 'localMarker',
      image: require('@/assets/map/local2.png'),
    });
    viewer.entities.add(markEntity);
  }
};

//平滑线段
export function smoothLinesWithCentripetal(lines: Cartesian3[][], samplesPerSegment = 30) {
  return lines.map((points) => {
    if (points.length < 2) return points;

    // 构造 centripetal 参数化 times
    const times: number[] = [0];
    for (let i = 1; i < points.length; i++) {
      const d = Cesium.Cartesian3.distance(points[i], points[i - 1]);
      times.push(times[i - 1] + Math.sqrt(d));
    }

    const spline = new Cesium.CatmullRomSpline({ times, points });

    // 采样平滑
    const maxT = times[times.length - 1];
    const steps = (points.length - 1) * samplesPerSegment;
    const delta = maxT / steps;
    const smooth: Cartesian3[] = [];
    for (let t = 0; t <= maxT; t += delta) {
      smooth.push(spline.evaluate(t));
    }
    return smooth;
  });
}

//地图效果
export class MapEffects {
  //道路特效
  // 静态方法 RoadShuttleEffects：在Cesium中绘制“道路穿梭”线段效果
  static RoadShuttleEffects = (
    viewer: Viewer, // Cesium Viewer 实例
    line: Cartesian3[][], // 线段点坐标的二维数组（每个子数组是一个线段的两个点）
    material?: Cesium.Material, // 可选，自定义材质（不传则用默认的SpriteLineMaterial）
  ): Cesium.Primitive | null => {
    let primitive: Cesium.Primitive | null = null;
    if (viewer && viewer.scene) {
      // 确认viewer和场景存在
      const instance: Cesium.GeometryInstance[] = [];
      // 道路穿梭材质（如果外部没有传material，则使用自定义的SpriteLineMaterial）
      const lineMaterial = SpriteLineMaterial({});

      // 遍历每一条线段
      line.forEach((lineSegment) => {
        // 检查这条线段是不是“两个点完全重合”
        if (lineSegment.length === 2 && lineSegment[0].equals(lineSegment[1])) {
          console.warn('点位相同,添加偏移');
          // 如果重合，给第二个点做微小偏移，避免生成无效几何
          lineSegment[1] = new Cesium.Cartesian3(
            lineSegment[1].x + 0.001,
            lineSegment[1].y + 0.001,
            lineSegment[1].z + 0.001,
          );
        }

        // 创建Cesium的PolylineGeometry（线的几何对象）
        const polyline = new Cesium.PolylineGeometry({
          positions: lineSegment, // 线的坐标
          width: 6, // 线宽（像素）
          vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT, // 适配材质的顶点格式
        });

        // 创建对应的Geometry（用来实例化GeometryInstance）
        const geometry = Cesium.PolylineGeometry.createGeometry(polyline);
        if (!geometry) {
          console.error('Failed to create geometry for polyline:', polyline);
          return; // 如果geometry创建失败，跳过
        }

        // 创建GeometryInstance并存入数组
        instance.push(new Cesium.GeometryInstance({ geometry }));
      });

      // 创建材质外观（Appearance），用自定义或默认的材质
      const appearance = new Cesium.PolylineMaterialAppearance({
        material: material ?? lineMaterial,
      });

      // 创建Cesium Primitive对象，将所有GeometryInstance一起加到Primitive里
      primitive = new Cesium.Primitive({
        geometryInstances: instance, // 所有的几何实例
        appearance, // 上面创建的材质外观
        asynchronous: false, // 同步方式渲染，保证立刻可见
      });
      // 把Primitive添加到场景中
      viewer.scene.primitives.add(primitive);
    }
    // 返回Primitive对象
    return primitive;
  };

  //点位特效
  static PointEffects = (
    viewer: Viewer,
    points: Cartesian3[],
    material?: Cesium.Color,
  ): string[] => {
    let r1 = 100; //指定扩散圆的最小半径，maxR为扩散圆的最大半径
    let r2 = 100;
    const cameraHeight = viewer.camera.positionCartographic.height;
    //扩散半径
    let r3 = cameraHeight / 10 / 2; //扩散范围
    const entityIds: string[] = []; // 存储添加的实体ID

    function changeR1() {
      //这是callback，参数不能内传
      r1 = r1 + 0.03; //deviationR为每次圆增加的大小
      if (r1 >= r3) {
        r1 = 30;
      }

      return r1;
    }

    function changeR2() {
      r2 = r2 + 0.03; //deviationR为每次圆增加的大小
      if (r2 >= r3) {
        r2 = 30;
      }
      return r2;
    }

    //添加点
    points.forEach((e, index) => {
      // 生成唯一ID
      const entityId = `fault-point-${new Date().getTime()}-${index}`;

      let entity;
      if (material === null || material === undefined) {
        entity = viewer.entities.add({
          id: entityId,
          position: e,
          point: {
            pixelSize: 10, // 点像素大小
            color: Cesium.Color.fromCssColorString('#b2ff59'), // 使用Cesium.Color
          },
          ellipse: {
            semiMinorAxis: new Cesium.CallbackProperty(changeR1, false),
            semiMajorAxis: new Cesium.CallbackProperty(changeR2, false),
            material: new Cesium.ImageMaterialProperty({
              image: require('@/assets/map/green.png'),
              repeat: new Cesium.Cartesian2(1.0, 1.0),
              transparent: true,
            }),
          },
        });
      } else {
        entity = viewer.entities.add({
          id: entityId,
          position: e,
          point: {
            pixelSize: 10, // 点像素大小
            color: material, // 使用Cesium.Color
            outlineColor: Cesium.Color.WHITE, // 边框颜色
            outlineWidth: 1, // 边框宽度 (像素)
          },
        });
      }

      // 添加实体ID到数组
      if (entity) {
        entityIds.push(entityId);
      }
    });

    // 返回添加的实体ID数组，供外部清除使用
    return entityIds;
  };
}

export default class MouseEvent {
  private viewer: Cesium.Viewer;
  private handler: Cesium.ScreenSpaceEventHandler;
  // private divDom: HTMLDivElement;

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    // this.divDom = document.createElement('div');
    // this.divDom.style.cssText = `
    //   position: fixed;
    //   bottom: 0;
    //   right: 0;
    //   width: 210px;
    //   height: 70px;
    //   background-color: rgba(0,0,0,0.5);
    //   color: #fff;
    //   font-size: 14px;
    //   line-height: 40px;
    //   text-align: center;
    //   z-index: 100;
    // `;
  }
  //鼠标移动显示坐标信息和高度
  public mouseMove = () => {
    // document.body.appendChild(this.divDom);

    //鼠标移动 显示经纬度和视角高度
    this.handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
      // 在椭球体（例如地球的椭球模型）上拾取一个坐标点
      const cartesian = this.viewer.camera.pickEllipsoid(
        movement.endPosition,
        this.viewer.scene.globe.ellipsoid,
      );
      if (cartesian) {
        const cameraHeight = this.viewer.camera.positionCartographic.height;
        let x = CoordTransforms.Cartesian3ToCartographic(cartesian);
        const A = 40487.57;
        const B = 0.00007096758;
        const C = 91610.74;
        const D = -40467.74;
        if (
          this.viewer.scene.globe._surface &&
          this.viewer.scene.globe._surface._tilesToRender &&
          this.viewer.scene.globe._surface._tilesToRender.length > 0
        ) {
          // @ts-ignore
          // 显示经纬度
          // this.divDom.innerHTML = `经度：${x.longitude.toFixed(4)} 纬度：${x.latitude.toFixed(4,)} 视角高度: ${cameraHeight.toFixed(2)} 层级: ${z}`;
          const lv = Math.round(D + (A - D) / (1 + Math.pow(Number(cameraHeight) / C, B))) + 1;

          console.log(
            '经度：' +
              `${x.longitude.toFixed(6)}` +
              ' 纬度：' +
              `${x.latitude.toFixed(6)}` +
              ' 视角高度:' +
              `${cameraHeight.toFixed(2)}` +
              ' 层级:' +
              `${lv}`,
          );
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  };

  public leftClick = (onChange: (position: Cartesian3) => void) => {
    this.handler.setInputAction((click: any) => {
      // 拾取鼠标位置在场景中的三维坐标，考虑了地形和 3D 对象
      const picked = this.viewer.scene.pickPosition(click.position);

      if (Cesium.defined(picked)) {
        // 将 Cartesian3 转换为经纬度坐标
        // let x = CoordTransforms.Cartesian3ToCartographic(picked);
        // const cartographic = Cesium.Cartographic.fromCartesian(picked);

        // 在这里调用搜索查询函数并传递经纬度
        onChange?.(picked);
      } else {
        console.log('点击位置无法转换为坐标');
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };
}
