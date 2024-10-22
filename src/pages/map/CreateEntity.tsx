import { Box, BoxConnectingLine, boxImages, Model, modelImages } from '@/pages/map/BoxTyping';
import { LatLng } from '@/pages/project/type';
import * as Cesium from 'cesium';
import { Cartesian2, Cartesian3, Color, Entity } from 'cesium';
//创建点
export const createPointEntity = (position: Cartesian3, info?: Box): Entity => {
  return new Entity({
    id: info?.id.toString(),
    name: info?.name,
    position: position,
    point: {
      pixelSize: 10, //点像素大小
      color: Color.RED, //点颜色，不能用rgb等css方法，需要用Cesium.Color
      //color: Cesium.Color.fromCssColorString('#ee0000'),
      outlineColor: Color.WHITE, // 边框颜色
      outlineWidth: 2, // 边框宽度(像素)
      //显示在距相机的距离处的属性，多少区间内是可以显示的
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1500),
      //show: true,
    },
    properties: {
      category: info?.type,
    },
  });
};

//创建线
export const createPolylineEntity = (latLngArray: LatLng[], info?: BoxConnectingLine): Entity => {
  const positionsArray = latLngArray.flatMap(({ longitude, latitude }) => [longitude, latitude]);
  return new Entity({
    id: info?.id.toString(),
    name: info?.name,
    polyline: {
      positions: Cartesian3.fromDegreesArray(positionsArray),
      // positions: new CallbackProperty(() => {
      //   return Cartesian3.fromDegreesArray(positionsArray);
      // }, false),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 25000),
      width: 3,
      material: Color.GREEN,
      // clampToGround: true, // 将polyline钉在地面上
    },
    properties: {
      type: info?.type,
    },
  });
};

///创建广告牌
export const createImageEntity = (position: LatLng, info?: Box): Entity => {
  const image = info ? boxImages[info.boxType] : require('@/assets/map/null.png');
  return new Entity({
    id: info?.id.toString(),
    name: info?.name,
    position: Cartesian3.fromDegrees(position.longitude, position.latitude),
    billboard: {
      image: image,
      height: 25,
      width: 25,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 25000),
      // disableDepthTestDistance: Number.POSITIVE_INFINITY, // Ensure billboard is always on top
    },
    properties: {
      type: info?.type,
      boxType: info?.boxType,
    },
  });
};

///模型
export const createModelEntity = (position: LatLng, info?: Model): Entity => {
  const uri = info ? modelImages[info.type] : require('@/assets/map/null.png');
  return new Entity({
    id: info?.id.toString(),
    name: info?.name,
    position: Cartesian3.fromDegrees(position.longitude, position.latitude),
    model: {
      uri: uri,
      minimumPixelSize: 50,
      maximumScale: 100,
      show: true,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 25000),
    },
    properties: {
      type: info?.type,
    },
  });
};

//定位
export const createLocalEntity = (position: Cartesian3): Entity => {
  return new Entity({
    id: 'local',
    name: 'local',
    position,
    billboard: {
      image: require('@/assets/map/fault.png'),
      height: 35,
      width: 35,
      pixelOffset: new Cartesian2(0, -15),
      disableDepthTestDistance: Number.POSITIVE_INFINITY, // Ensure billboard is always on top
    },
    properties: {
      type: 'other',
    },
  });
};
