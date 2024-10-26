/*
     圆形扩散波纹材质
     color 颜色
     duration 持续时间 毫秒
     count 数量
     gradient 渐变
 */
function CircleWaveMaterialProperty(options) {
  options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
  this._definitionChanged = new Cesium.Event();
  this._color = undefined;
  this._colorSubscription = undefined;
  this.color = options.color;
  this.duration = Cesium.defaultValue(options.duration, 1e3);
  this.count = Cesium.defaultValue(options.count, 2);
  if (this.count <= 0) this.count = 1;
  this.gradient = Cesium.defaultValue(options.gradient, 0.1);
  if (this.gradient < 0) this.gradient = 0;
  else if (this.gradient > 1) this.gradient = 1;
  this._time = performance.now();
}

/**
 * 自定义材质
 */
function _getCircleWaveShader() {
  return `
  uniform float time;
  uniform float count;
  uniform float gradient;
  uniform vec4 color;
  czm_material czm_getMaterial(czm_materialInput materialInput)
  {
          czm_material material = czm_getDefaultMaterial(materialInput);
          material.diffuse = 1.5 * color.rgb;
          vec2 st = materialInput.st;
          vec3 str = materialInput.str;
          float dis = distance(st, vec2(0.5, 0.5));
          float per = fract(time);
          if (abs(str.z) > 0.001) {
              discard;
          }
          if (dis > 0.5) {
              discard;
          } else {
              float perDis = 0.5 / count;
              float disNum;
              float bl = .0;
              for (int i = 0; i <= 999; i++) {
                  if (float(i) <= count) {
                      disNum = perDis * float(i) - dis + per / count;
                      if (disNum > 0.0) {
                              if (disNum < perDis) {
                                  bl = 1.0 - disNum / perDis;
                              }
                              else if (disNum - perDis < perDis) {
                                  bl = 1.0 - abs(1.0 - disNum / perDis);
                              }
                              material.alpha = pow(bl, gradient);
                          }
                  }
              }
          }
      return material;
  }
  `;
}

Object.defineProperties(CircleWaveMaterialProperty.prototype, {
  isConstant: {
    get: function () {
      return false;
    },
  },
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
  color: Cesium.createPropertyDescriptor('color'),
});

let MaterialType = 'waveType' + parseInt(Math.random() * 1000);
CircleWaveMaterialProperty.prototype.getType = function (time) {
  return MaterialType;
};

CircleWaveMaterialProperty.prototype.getValue = function (time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }
  result.color = Cesium.Property.getValueOrClonedDefault(
    this._color,
    time,
    Cesium.Color.WHITE,
    result.color,
  );
  result.time = (performance.now() - this._time) / this.duration;
  result.count = this.count;
  result.gradient = 1 + 10 * (1 - this.gradient);
  return result;
};

CircleWaveMaterialProperty.prototype.equals = function (other) {
  return (
    this === other ||
    (other instanceof CircleWaveMaterialProperty &&
      Cesium.Property.equals(this._color, other._color))
  );
};

Cesium.Material._materialCache.addMaterial(MaterialType, {
  fabric: {
    type: MaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      time: 1,
      count: 1,
      gradient: 0.1,
    },
    source: _getCircleWaveShader(),
  },
  translucent: function (material) {
    return !0;
  },
});

Cesium.CircleWaveMaterialProperty = CircleWaveMaterialProperty;
