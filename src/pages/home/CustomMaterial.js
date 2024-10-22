import * as Cesium from 'cesium';

//entity实现
// function CustomMaterial(duration, image) {
//   this._definitionChanged = new Cesium.Event(); // Cesium的事件订阅
//   this.duration = duration; // 参数：光流的持续时间
//   this.image = image; // 参数：光流的材质贴图
//   this._time = performance.now(); // 记录时间线
// }
// Object.defineProperties(CustomMaterial.prototype, {
//   isConstant: {
//     get: function () {
//       return false;
//     },
//   },
//   definitionChanged: {
//     get: function () {
//       return this._definitionChanged;
//     },
//   },
//   color: Cesium.createPropertyDescriptor('color'), // createPropertyDescriptor为color属性创建'setter'和'getter'的函数”
//   duration: Cesium.createPropertyDescriptor('duration'),
// });
// // 设置材质类型名称
// CustomMaterial.prototype.getType = function (time) {
//   return 'Spriteline';
// };
// // 设置材质的值
// CustomMaterial.prototype.getValue = function (time, result) {
//   if (!Cesium.defined(result)) {
//     result = {};
//   }
//   result.image = this.image;
//   result.time = ((performance.now() - this._time) % this.duration) / this.duration;
//   return result;
// };
//
// Cesium.CustomMaterial.SpritelineType = 'Spriteline1';
// // 着色器代码
// Cesium.CustomMaterial.SpritelineSource = `
// // 定义一个名为czm_getMaterial的函数，它接受一个czm_materialInput类型的参数materialInput
// czm_material czm_getMaterial(czm_materialInput materialInput)
// {
// // 使用Cesium提供的函数来获取默认材质。
// czm_material material = czm_getDefaultMaterial(materialInput);
//  // 从传入的materialInput中获取二维纹理坐标。
// vec2 st = materialInput.st;
// // 使用texture函数对指定的纹理图像进行采样，并使用fract函数来实现纹理的流动效果。
// // 这里的speed变量控制流动速度，用于实现动态效果。
// vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));
// // 将采样到的透明度附着给材质的透明度alpha属性
// material.alpha = colorImage.a;
// // 将采样得到的纹理的rgb值乘以1.5，设置为材质的diffuse颜色。
// // 这里乘以1.5是为了增强颜色的亮度。
// material.diffuse = colorImage.rgb * 1.5 ;
// return material;
// }
// `;
// // _materialCache是Cesium.Material的私有属性，用来缓存自定义材质
// Cesium.CustomMaterial._materialCache.addMaterial(Cesium.CustomMaterial.SpritelineType, {
//   fabric: {
//     type: Cesium.CustomMaterial.SpritelineType,
//     // uniforms的属性都是传给着色器代码的SpritelineSource
//     uniforms: {
//       color: new Cesium.Color(1, 0, 0, 0.5),
//       image: '',
//       transparent: true,
//       time: 20,
//     },
//     source: Cesium.CustomMaterial.SpritelineSource,
//   },
//   translucent: function (material) {
//     return true;
//   },
// });

//穿梭线材质-primitives
export function SpritelineMaterial({
  color = '#5fff75',
  image = require('../../assets/map/spriteline.png'),
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
      material.diffuse = colorImage.rgb * 1.5;
      return material;
    }
  `;

  return new Cesium.Material({
    fabric: {
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

//材质类
export class CircleDiffuseMaterialProperty {
  constructor(options) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._speed = undefined;
    this.color = options.color;
    this.speed = options.speed;
  }

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType(time) {
    return Cesium.Material.CircleDiffuseMaterialType;
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }

    result.color = Cesium.Property.getValueOrDefault(
      this._color,
      time,
      Cesium.Color.fromCssColorString('#bef17c'),
      result.color,
    );
    result.speed = Cesium.Property.getValueOrDefault(this._speed, time, result.speed);
    return result;
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof CircleDiffuseMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed))
    );
  }
}

Object.defineProperties(CircleDiffuseMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
});

Cesium.Material.CircleDiffuseMaterialProperty = 'CircleDiffuseMaterialProperty';
Cesium.Material.CircleDiffuseMaterialType = 'CircleDiffuseMaterialType';
Cesium.Material.CircleDiffuseMaterialSource = `
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

Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleDiffuseMaterialType, {
  fabric: {
    type: Cesium.Material.CircleDiffuseMaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      speed: 10.0,
    },
    source: Cesium.Material.CircleDiffuseMaterialSource,
  },
  translucent: function (material) {
    return true;
  },
});
