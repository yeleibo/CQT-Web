// utils/initializeViewer.ts
import { CircleDiffuseMaterialProperty, SpritelineMaterial } from '@/pages/home/CustomMaterial';
import MapDialog from '@/pages/home/OpticalCableMonitoring/MapDialog';
import { OpticalCableMonitoringModel } from '@/pages/home/OpticalCableMonitoring/typings';
import { createLocalEntity } from '@/pages/map/CreateEntity';
import { MapLayer, TianDiTuOtherMapLayer } from '@/pages/map/MapLayersTyping';
import { LatLng } from '@/pages/project/type';
import * as Cesium from 'cesium';
import { BoundingSphere, Cartesian3, Viewer } from 'cesium';
import { createRoot } from 'react-dom/client';

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
    sceneMode: Cesium.SceneMode.SCENE2D, //初始场景模式
    // mapMode2D: Cesium.MapMode2D.ROTATE,
    fullscreenElement: document.body, //全屏时渲染的HTML元素,
    orderIndependentTranslucency: false,

    contextOptions: {
      webgl: {
        alpha: true,
      },
    },
  });
  //取消显示左下角版权信息
  // @ts-ignore
  viewer.cesiumWidget.creditContainer.style.display = 'none';

  //显示帧数
  // viewer.scene.debugShowFramesPerSecond = true;
  // 去掉黑色星空背景，设置为透明
  viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT;
  viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT;

  viewer.imageryLayers.removeAll();

  viewer.imageryLayers.addImageryProvider(baseMapLayer.imageryProvider);
  //天地图
  if (baseMapLayer.type === 'tianditu') {
    viewer.imageryLayers.addImageryProvider(TianDiTuOtherMapLayer.imageryProvider);
  }

  //地图平移
  viewer.scene.screenSpaceCameraController.enableTranslate = true;
  viewer.scene.screenSpaceCameraController.enableLook = false;
  //抗锯齿
  viewer.scene.postProcessStages.fxaa.enabled = true;
  // viewer.scene.msaaSamples = 2;
  //场景默认视图-亚洲
  Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(90, -20, 110, 90);

  onInitialized(viewer);
};

//飞到某一点
export const flyToLocation = (
  viewer: Viewer, // 传入 viewer 实例
  latLng?: LatLng, // 可选的目标位置
) => {
  let target;
  if (viewer) {
    if (latLng) {
      const localEntity = createLocalEntity(
        Cartesian3.fromDegrees(latLng.longitude, latLng.latitude, 0),
      );
      viewer.entities.removeById('local'); // 使用传入的 viewer 实例
      viewer.entities.add(localEntity);
      target = Cartesian3.fromDegrees(latLng.longitude, latLng.latitude, 1200);
      const boundingSphere = new BoundingSphere(target, 5000);
      viewer.camera.flyToBoundingSphere(boundingSphere, { duration: 1 });
    }
  }
};

// 道路特效
export const createRoadEffects = (
  viewer: Viewer,
  opticalCableMonitoringModel: OpticalCableMonitoringModel,
) => {
  const instance: Cesium.GeometryInstance[] = [];
  // 道路穿梭材质
  const lineMaterial = SpritelineMaterial({});
  // 扩散材质
  const pointMaterial = new CircleDiffuseMaterialProperty(Cesium.Color.GREEN, 200);

  //添加线
  opticalCableMonitoringModel.fiberLines.forEach((line) => {
    // 在光纤路径上创建流动效果
    const polyline = new Cesium.PolylineGeometry({
      positions: Cartesian3.fromDegreesArray(
        line.flatMap((point) => [point.longitude, point.latitude]),
      ),
      width: 5,
      vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
    });
    const geometry = Cesium.PolylineGeometry.createGeometry(polyline);
    // @ts-ignore
    instance.push(new Cesium.GeometryInstance({ geometry }));
  });

  const appearance = new Cesium.PolylineMaterialAppearance({
    material: lineMaterial,
  });

  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: instance,
      appearance,
      asynchronous: false,
    }),
  );

  //添加点
  opticalCableMonitoringModel.dataCenterPoints.forEach((point) => {
    viewer.entities.add({
      position: Cartesian3.fromDegrees(point.longitude, point.latitude),
      point: {
        pixelSize: 10,
        color: Cesium.Color.fromCssColorString('#b2ff59'),
      },
      ellipse: {
        semiMinorAxis: 600.0,
        semiMajorAxis: 600.0,
        material: pointMaterial,
      },
    });
  });
};

//道路特效
export const createRoadShuttleEffects = (
  viewer: Viewer,
  line: Cartesian3[][],
  material?: Cesium.Material,
): Cesium.Primitive => {
  const instance: Cesium.GeometryInstance[] = [];
  // 道路穿梭材质
  const lineMaterial = SpritelineMaterial({});
  //添加线
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

  const primitive = new Cesium.Primitive({
    geometryInstances: instance,
    appearance,
    asynchronous: false,
  });
  viewer.scene.primitives.add(primitive);
  return primitive;
  // viewer.scene.primitives.add(
  //   new Cesium.Primitive({
  //     geometryInstances: instance,
  //     appearance,
  //     asynchronous: false,
  //   }),
  // );
};

export class CesiumMapDialog {
  private viewer: Cesium.Viewer;
  private position: Cesium.Cartesian3;
  private container: HTMLDivElement;
  private isVisible: boolean = false;
  private mapRoot: ReturnType<typeof createRoot>;
  private title: string;
  private content: string;

  // 静态变量，用于存储当前活动的弹窗实例
  private static activeDialog: CesiumMapDialog | null = null;

  constructor(opts: {
    viewer: Cesium.Viewer;
    position: Cesium.Cartesian3;
    title: string;
    content: string;
  }) {
    const { viewer, position, title, content } = opts;
    this.viewer = viewer;
    this.position = position;
    this.title = title;
    this.content = content;
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';

    // 将弹窗元素添加到 Cesium 的容器中
    viewer.cesiumWidget.container.appendChild(this.container);

    // 创建 React root
    this.mapRoot = createRoot(this.container);

    // 关闭之前的弹窗
    CesiumMapDialog.activeDialog?.closeDialog();

    // 设置当前弹窗为活跃弹窗
    CesiumMapDialog.activeDialog = this;

    // 添加 Cesium 场景渲染事件的监听器
    this.updatePosition = this.updatePosition.bind(this);
    this.viewer.scene.postRender.addEventListener(this.updatePosition);

    // 手动显示弹窗
    this.showDialog();
    // 渲染弹窗
    this.renderDialog();
  }

  // 渲染弹窗 React 组件
  private renderDialog() {
    this.mapRoot.render(
      <MapDialog
        title={this.title}
        content={this.content}
        onClose={() => this.closeDialog()}
        isVisible={this.isVisible}
      />,
    );
  }

  // 显示弹窗
  public showDialog() {
    this.isVisible = true;
  }

  // 更新弹窗在屏幕上的位置
  private updatePosition() {
    if (!this.isVisible) return;

    const canvasHeight = this.viewer.scene.canvas.height;
    const windowPosition = Cesium.SceneTransforms.worldToWindowCoordinates(
      this.viewer.scene,
      this.position,
    );

    if (windowPosition) {
      this.container.style.bottom = `${canvasHeight - windowPosition.y}px`;
      this.container.style.left = `${windowPosition.x + 20}px`;
    }
  }

  // 关闭弹窗
  public closeDialog() {
    if (!this.isVisible) return;

    this.isVisible = false;
    this.viewer.scene.postRender.removeEventListener(this.updatePosition);

    // 清除当前活跃的弹窗
    if (CesiumMapDialog.activeDialog === this) {
      CesiumMapDialog.activeDialog = null;
    }

    // 移除 DOM 元素
    // 延迟卸载以避免同步卸载问题
    setTimeout(() => {
      this.mapRoot.unmount();
      this.container.remove();
    }, 0);
  }
}
