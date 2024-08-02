import { Box, BoxConnectingLine, boxImages } from '@/pages/map/BoxTyping';
import { LatLng } from '@/pages/project/type';
import { CallbackProperty, Cartesian3, Color, Entity } from 'cesium';

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
      positions: new CallbackProperty(() => {
        return Cartesian3.fromDegreesArray(positionsArray);
      }, false),
      width: 5,
      material: Color.GREEN,
      zIndex: 1,
    },
    properties: {
      type: info?.type,
    },
  });
};

///创建广告牌
export const createImageEntity = (position: Cartesian3, info?: Box): Entity => {
  const image = info ? boxImages[info.boxType] : '';
  return new Entity({
    id: info?.id.toString(),
    name: info?.name,
    position,
    billboard: {
      image: image,
      height: 25,
      width: 25,
    },
    properties: {
      type: info?.type,
      boxType: info?.boxType,
    },
  });
};
