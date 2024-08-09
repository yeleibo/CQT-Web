import { Box, BoxConnectingLine, boxImages } from '@/pages/map/BoxTyping';
import { LatLng } from '@/pages/project/type';
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
export const createImageEntity = (position: Cartesian3, info?: Box): Entity => {
  const image = info ? boxImages[info.boxType] : require('@/assets/map/box4.png');
  return new Entity({
    id: info?.id.toString(),
    name: info?.name,
    position,
    billboard: {
      image: image,
      height: 25,
      width: 25,
      // disableDepthTestDistance: Number.POSITIVE_INFINITY, // Ensure billboard is always on top
    },
    properties: {
      type: info?.type,
      boxType: info?.boxType,
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
      image: require('@/assets/map/local.png'),
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
