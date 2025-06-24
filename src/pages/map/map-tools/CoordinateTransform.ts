// 定义一些常量
// import Cesium, { Cartesian3} from 'cesium';

import {Cartesian3} from "cesium";
import * as Cesium from "cesium";

const BD_FACTOR = (3.14159265358979324 * 3000.0) / 180.0;
const PI = 3.1415926535897932384626;
const RADIUS = 6378245.0;
const EE = 0.00669342162296594323;

class CoordTransforms {
  /**
   * BD-09(百度坐标系) To GCJ-02(火星坐标系)
   * @param lng
   * @param lat
   * @returns {number[]}
   */
  static BD09ToGCJ02(lng: number, lat: number) {
    let x = +lng - 0.0065;
    let y = +lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * BD_FACTOR);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * BD_FACTOR);
    let gg_lng = z * Math.cos(theta);
    let gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
  }

  /**
   * GCJ-02(火星坐标系) To BD-09(百度坐标系)
   * @param lng
   * @param lat
   * @returns {number[]}
   * @constructor
   */
  static GCJ02ToBD09(lng: number, lat: number) {
    const Lat = +lat;
    const Lng = +lng;
    let z = Math.sqrt(Lng * Lng + Lat * Lat) + 0.00002 * Math.sin(Lat * BD_FACTOR);
    let theta = Math.atan2(Lat, Lng) + 0.000003 * Math.cos(Lng * BD_FACTOR);
    let bd_lng = z * Math.cos(theta) + 0.0065;
    let bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat];
  }

  /**
   * WGS-84(世界大地坐标系) To GCJ-02(火星坐标系)
   * @param lng
   * @param lat
   * @returns {number[]}
   */
  static WGS84ToGCJ02(lng: number, lat: number) {
    const Lat = +lat;
    const Lng = +lng;
    if (this.out_of_china(Lng, Lat)) {
      return [Lng, Lat];
    } else {
      let d = this.delta(Lng, Lat);
      return [Lng + d[0], Lat + d[1]];
    }
  }

  /**
   * GCJ-02(火星坐标系) To WGS-84(世界大地坐标系)
   * @param lng
   * @param lat
   * @returns {number[]}
   * @constructor
   */
  static GCJ02ToWGS84(lng: number, lat: number) {
    const Lat = +lat;
    const Lng = +lng;
    if (this.out_of_china(Lng, Lat)) {
      return [Lng, Lat];
    } else {
      let d = this.delta(Lng, Lat);
      let mgLng = Lng + d[0];
      let mgLat = Lat + d[1];
      return [Lng * 2 - mgLng, Lat * 2 - mgLat];
    }
  }

  /**
   *
   * @param lng
   * @param lat
   * @returns {number[]}
   */
  static delta(lng: number, lat: number) {
    let dLng = this.transformLng(lng - 105, lat - 35);
    let dLat = this.transformLat(lng - 105, lat - 35);
    const radLat = (lat / 180) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - EE * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLng = (dLng * 180) / ((RADIUS / sqrtMagic) * Math.cos(radLat) * PI);
    dLat = (dLat * 180) / (((RADIUS * (1 - EE)) / (magic * sqrtMagic)) * PI);
    return [dLng, dLat];
  }

  /**
   *
   * @param lng
   * @param lat
   * @returns {number}
   */
  static transformLng(lng: number, lat: number) {
    const Lat = +lat;
    const Lng = +lng;
    let ret = 300.0 + Lng + 2.0 * Lat + 0.1 * Lng * Lng + 0.1 * Lng * Lat + 0.1 * Math.sqrt(Math.abs(Lng));
    ret += ((20.0 * Math.sin(6.0 * Lng * PI) + 20.0 * Math.sin(2.0 * Lng * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(Lng * PI) + 40.0 * Math.sin((Lng / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((Lng / 12.0) * PI) + 300.0 * Math.sin((Lng / 30.0) * PI)) * 2.0) / 3.0;
    return ret;
  }

  /**
   *
   * @param lng
   * @param lat
   * @returns {number}
   */
  static transformLat(lng: number, lat: number) {
    const Lat = +lat;
    const Lng = +lng;
    let ret = -100.0 + 2.0 * Lng + 3.0 * Lat + 0.2 * Lat * Lat + 0.1 * Lng * Lat + 0.2 * Math.sqrt(Math.abs(Lng));
    ret += ((20.0 * Math.sin(6.0 * Lng * PI) + 20.0 * Math.sin(2.0 * Lng * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(Lat * PI) + 40.0 * Math.sin((Lat / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((Lat / 12.0) * PI) + 320 * Math.sin((Lat * PI) / 30.0)) * 2.0) / 3.0;
    return ret;
  }

  /**
   * 判断是否在国内。不在国内不做偏移
   * @param lng
   * @param lat
   * @returns {boolean}
   */
  static out_of_china(lng: number, lat: number) {
    const Lat = +lat;
    const Lng = +lng;
    return !(Lng > 73.66 && Lng < 135.05 && Lat > 3.86 && Lat < 53.55);
  }

  //Cartesian3 转换为 Cartographic
  static Cartesian3ToCartographic(position:Cartesian3) {
    const cartographicPosition = Cesium.Cartographic.fromCartesian(position);
    const longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
    const latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
    const height = cartographicPosition.height;
    return {longitude,latitude,height};
  }

  //  Cartographic 转换为 Cartesian3
  static CartographicToCartesian3(longitude:number,latitude:number,height:number) {
    return Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
  }

}

export default CoordTransforms;
