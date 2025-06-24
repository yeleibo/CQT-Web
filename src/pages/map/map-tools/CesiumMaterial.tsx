import * as Cesium from 'cesium';
import { createRoot } from 'react-dom/client';
import MapDialog from '@/pages/map/map-widget/MapDialog';

//故障线路
export function faultyCableMaterial() {
  const faultyCablSource = `
uniform float frequency;
czm_material czm_getMaterial(czm_materialInput materialInput) {
    // 获取默认材质
    czm_material material = czm_getDefaultMaterial(materialInput);

    // 获取纹理坐标
    vec2 st = materialInput.st;

    // 定义颜色
    vec3 lightRed = vec3(1.0, 0.3, 0.3);   // 浅红色
    vec3 lightGray = vec3(0.3, 0.3, 0.3);  // 浅灰色

    // 计算当前片元在周期中的位置
    float pattern = fract(materialInput.s * frequency);

    // 根据位置决定颜色，浅红色占比 60%，浅灰色占比 40%
    vec3 color = mix(lightRed, lightGray, step(0.6, pattern));

    // 设置材质的漫反射颜色
    material.diffuse = color;

    // 设置材质的透明度
    material.alpha = 1.0;

    return material;
}
`;

  return new Cesium.Material({
    fabric: {
      type: 'FaultyCableMaterial',
      uniforms: {
        frequency: 5.0, // 默认频率
      },
      source: faultyCablSource,
    },
  });
}

//道路穿梭
export function SpriteLineMaterial({
  color = '#5fff75',
  image = require('../../../assets/map/spriteline.png'),
  speed = 5,
}) {
  const source = `
  // 定义一个名为czm_getMaterial的函数，它接受一个czm_materialInput类型的参数materialInput
    czm_material czm_getMaterial(czm_materialInput materialInput) {
      // 使用Cesium提供的函数来获取默认材质。
      czm_material material = czm_getDefaultMaterial(materialInput);
      // 从传入的materialInput中获取二维纹理坐标。
      vec2 st = materialInput.st;
      // 使用texture函数对指定的纹理图像进行采样，并使用fract函数来实现纹理的流动效果。
      vec4 colorImage = texture(image, vec2(fract((st.s - speed * czm_frameNumber * 0.001)), st.t));
      // 将采样到的透明度附着给材质的透明度alpha属性
      material.alpha = colorImage.a * color.a;
      // 将采样得到的纹理的rgb值乘以1.5，设置为材质的diffuse颜色。
      // 这里乘以1.5是为了增强颜色的亮度。
      material.diffuse = colorImage.rgb * 1.8;
      return material;
    }
  `;

  return new Cesium.Material({
    fabric: {
      type: 'SpriteLineMaterial',
      uniforms: {
        color: Cesium.Color.fromCssColorString(color),
        image: image,
        speed: speed,
      },
      source: source,
    },
    //自定义
    translucent: function () {
      return true;
    },
  });
}

//扩散
export function CircleDiffuseMaterial({ color = '#5fff75', speed = 10 }) {
  const source = `
  uniform vec4 color;
  uniform float speed;

  vec3 circlePing(float r, float innerTail,  float frontierBorder, float timeResetSeconds,  float radarPingSpeed,  float fadeDistance){
  float t = fract(czm_frameNumber * speed / 1000.0);
  float time = mod(t, timeResetSeconds) * radarPingSpeed;
  float circle;
  circle += smoothstep(time - innerTail, time, r) * smoothstep(time + frontierBorder,time, r);
  circle *= smoothstep(fadeDistance, 0.0, r);
  return vec3(circle);
  }

  czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st * 2.0  - 1.0 ;
  vec2 center = vec2(0.);
  float time = fract(czm_frameNumber * speed / 1000.0);
  vec3 flagColor;
  float r = length(st - center) / 4.;
  flagColor += circlePing(r, 0.25, 0.025, 4.0, 0.3, 1.0) * color.rgb;
  material.alpha = length(flagColor);
  material.diffuse = flagColor.rgb;
  return material;
  }
  `;

  return new Cesium.Material({
    fabric: {
      type: 'CircleDiffuseMaterial',
      uniforms: {
        color: Cesium.Color.fromCssColorString(color),
        speed: speed,
      },
      source: source,
    },
    //自定义
    translucent: function () {
      return true;
    },
  });
}

export class CesiumMapDialog {
  private viewer: Cesium.Viewer;
  private position: Cesium.Cartesian3;
  private container: HTMLDivElement;
  private isVisible: boolean = false;
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
    const ReactDOM = require('react-dom');
    const React = require('react');
    
    ReactDOM.render(
      React.createElement(MapDialog, {
        title: this.title,
        content: this.content,
        onClose: () => this.closeDialog()
      }),
      this.container
    );
  }

  // 显示弹窗
  public showDialog() {
    this.isVisible = true;
  }

  // 隐藏弹窗
  public hideDialog() {
    this.isVisible = false;
    this.renderDialog();
  }

  // 切换弹窗的显示状态
  public toggleDialog() {
    this.isVisible = !this.isVisible;
    this.renderDialog();
  }

  // 设置弹窗标题
  public setTitle(newTitle: string) {
    this.title = newTitle;
    if (this.isVisible) {
      this.renderDialog();
    }
  }

  // 设置弹窗内容
  public setContent(newContent: string) {
    this.content = newContent;
    if (this.isVisible) {
      this.renderDialog();
    }
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

    if (this.viewer && this.viewer.scene) {
      this.viewer.scene.postRender.removeEventListener(this.updatePosition);
    }

    // 清除当前活跃的弹窗
    if (CesiumMapDialog.activeDialog === this) {
      CesiumMapDialog.activeDialog = null;
    }

    // 移除 DOM 元素
    // 延迟卸载以避免同步卸载问题
    setTimeout(() => {
      const ReactDOM = require('react-dom');
      ReactDOM.unmountComponentAtNode(this.container);
      if (this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    }, 0);
  }
}
