export type latLng = {
  latitude: number;
  longitude: number;
};
export type LatLon = {
  lat: number;
  lon: number;
};
interface DeviceImage {
  imageId: number;
  url: string;
}
interface DevicePort {
  portNum: number;
  status: number;
}
export type Device = {
  layerName: string;
  layerType: string;
  image?: string;
  id: number;
  name: string;
  type: string;
  points: LatLon[];
  pointsAll?: LatLon[];
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
  latLng: latLng;
  listPoint: latLng[];
  zoomLevel?: number;
  device?: Device;
  planId?: number;
};
