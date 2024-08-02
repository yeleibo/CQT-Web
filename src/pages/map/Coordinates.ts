import * as Cesium from 'cesium';

class Coordinates {
  private _viewer: Cesium.Viewer | undefined;

  constructor(viewer?: Cesium.Viewer) {
    if (viewer) {
      this._viewer = viewer;
    }
  }

  // 弧度 转 度
  RadianToDegrees(radian: number): number | null {
    return radian ? Cesium.Math.toDegrees(radian) : null;
  }

  // 度 转 弧度
  DegreesToRadian(deg: number): number | null {
    return deg ? Cesium.Math.toRadians(deg) : null;
  }

  /**
   * @description: 笛卡尔3 转 弧度
   * @param {Cesium.Cartesian3} cartesian
   * @return {Cesium.Cartographic | undefined}
   */
  Cartesian3ToCartographic(cartesian: Cesium.Cartesian3): Cesium.Cartographic | undefined {
    if (this._viewer && cartesian) {
      return Cesium.Cartographic.fromCartesian(cartesian);
    }
    return undefined;
  }

  /**
   * @description: 弧度 转 笛卡尔3
   * @param {Cesium.Cartographic} cartographic
   * @return {Cesium.Cartesian3 | undefined}
   */
  CartographicToCartesian3(cartographic: Cesium.Cartographic): Cesium.Cartesian3 | undefined {
    if (this._viewer && cartographic) {
      return Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height || 0,
      );
    }
    return undefined;
  }

  /**
   * @description: 84经纬度 转 弧度
   * @param {Cesium.Cartographic | [number, number, number?]} position
   * @return {Cesium.Cartographic}
   */
  LonLatToCartographic(
    position: Cesium.Cartographic | [number, number, number?],
  ): Cesium.Cartographic {
    if (this._viewer && position) {
      let longitude: number, latitude: number, height: number;
      if (Array.isArray(position)) {
        [longitude, latitude, height = 0] = position;
      } else {
        longitude = position.longitude;
        latitude = position.latitude;
        height = position.height || 0;
      }
      return Cesium.Cartographic.fromDegrees(longitude, latitude, height);
    }
    return Cesium.Cartographic.ZERO;
  }

  /**
   * @description: 弧度 转 84经纬度
   * @param {Cesium.Cartographic} cartographic
   * @return { { longitude: number; latitude: number; height: number } | undefined }
   */
  CartographicToLonLat(
    cartographic: Cesium.Cartographic,
  ): { longitude: number; latitude: number; height: number } | undefined {
    if (this._viewer && cartographic) {
      return {
        longitude: this.RadianToDegrees(cartographic.longitude),
        latitude: this.RadianToDegrees(cartographic.latitude),
        height: cartographic.height || 0,
      };
    }
    return undefined;
  }

  /**
   * @description: 笛卡尔3 转 84经纬度
   * @param {Cesium.Cartesian3} cartesian
   * @return { { longitude: number; latitude: number; height: number } | undefined }
   */
  Cartesian3ToLonLat(
    cartesian: Cesium.Cartesian3,
  ): { longitude: number; latitude: number; height: number } | undefined {
    if (this._viewer && cartesian) {
      const ellipsoid = Cesium.Ellipsoid.WGS84;
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);
      return this.CartographicToLonLat(cartographic);
    }
    return undefined;
  }

  /**
   * @description: 84经纬度 转 笛卡尔3
   * @param { { longitude: number; latitude: number; height?: number } } lonlat
   * @return {Cesium.Cartesian3 | undefined}
   */
  LonLatToCartesian3(lonlat: {
    longitude: number;
    latitude: number;
    height?: number;
  }): Cesium.Cartesian3 | undefined {
    if (this._viewer) {
      return lonlat
        ? Cesium.Cartesian3.fromDegrees(
            lonlat.longitude,
            lonlat.latitude,
            (lonlat.height = lonlat.height || 0),
            Cesium.Ellipsoid.WGS84,
          )
        : Cesium.Cartesian3.ZERO;
    }
    return undefined;
  }
}

const coordinates = new Coordinates(); // 坐标转换实例

/**
 * @description: 批量转换坐标
 * @param {Array} arr 被转换数组
 * @param {String} from 被转换数据的类型（首字母大写）
 * @param {String} to 要转换的数据类型（首字母大写）
 * @return {Array} 转换后的数组
 */
const batchChange = function (arr: any[], from: string, to: string): any[] {
  return arr.reduce((result, item) => {
    result.push(coordinatesChange(item, from, to));
    return result;
  }, []);
};

/**
 * @description: 单个坐标转换
 * @param {Object} obj 被转换的坐标
 * @param {String} from 被转换数据的类型（首字母大写）
 * @param {String} to 要转换的数据类型（首字母大写）
 * @return {Object} 转换后的坐标
 */
const coordinatesChange = function (obj: any, from: string, to: string): any {
  const functionName = `${from}To${to}`;
  return (coordinates as any)[functionName] ? (coordinates as any)[functionName](obj) : null;
};

export { batchChange, coordinatesChange };

export default coordinates;
