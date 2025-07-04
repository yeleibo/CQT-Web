
//gis服务的
interface DeviceImage {
  imageId: number;
  url: string;
}
interface DevicePort {
  portNum: number;
  status: number;
}
type LatLng={
  lat: number;
  lon: number;
}
export type Device = {
  layerName: string;
  layerType: string;
  image?: string;
  id: number;
  name: string;
  type: string;
  points: LatLng[];
  pointsAll?: LatLng[];
  attributes: unknown;
  images: DeviceImage[];
  projectId?: number;
  ports?: DevicePort[];
  online?: number;
  onuPower?: number;
  isOnline: boolean;
};

export function deviceFromJson(json: any): Device {
  return {
    layerName: json.layerName,
    layerType: json.layerType,
    image: json.image,
    id: json.id,
    name: json.name,
    type: json.type,
    points: json.points.map((point: any) => ({
      latitude: point.latitude,
      longitude: point.longitude,
    })),
    pointsAll: json.pointsAll
      ? json.pointsAll.map((point: any) => ({
          latitude: point.latitude,
          longitude: point.longitude,
        }))
      : undefined,
    attributes: json.attributes,
    images: json.images.map((image: any) => ({
      url: image.url,
      description: image.description,
    })),
    projectId: json.projectId,
    ports: json.ports
      ? json.ports.map((port: any) => ({
          id: port.id,
          name: port.name,
          status: port.status,
        }))
      : undefined,
    online: json.online,
    onuPower: json.onuPower,
    isOnline: json.isOnline,
  };
}

export type DeviceQueryParam = {
  keyword?: string;
  excludeLayers: number[];
  latLng: LatLng;
  listPoint: LatLng[];
  zoomLevel?: number;
  device?: Device;
  planId?: number;
};

export enum DataType {
  Point = 1,
  Polyline = 2,
  Box = 3,
}

//线
export class BoxConnectingLine {
  constructor(
    public id: number,
    public name: string,
    public type: DataType,
    public latLng: LatLng[],
    public mark?: string,
  ) {}
}

//盒子
export enum BoxType {
  HBox = 'HBox',
  FatBox = 'FatBox',
  EndBox = 'EndBox',
  SubBox = 'SubBox',
}

export class Box {
  constructor(
    public id: number,
    public name: string,
    public type: DataType,
    public boxType: BoxType,
    public latLng: LatLng,
    public mark?: string,
  ) {}
}

export const boxImages = {
  [BoxType.HBox]: require('@/assets/map/box1.png'),
  [BoxType.FatBox]: require('@/assets/map/box2.png'),
  [BoxType.EndBox]: require('@/assets/map/box3.png'),
  [BoxType.SubBox]: require('@/assets/map/box2.png'),
};

export enum ModelType {
  //楼栋
  building = 1,
}

export const modelImages = {
  [ModelType.building]: require('../../../public/models/OfficePlan.gltf'),
};

export class Model {
  constructor(
    public id: number,
    public name: string,
    public type: ModelType,
    public latLng: LatLng,
    public mark?: string,
  ) {}
}
