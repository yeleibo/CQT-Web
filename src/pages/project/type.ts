export type ResourceStatistic={
  type: AreaResourceType;
  totalCount: number;
}

export enum AreaResourceType {
  ChaoqianXBox = 0,
  ChaoqianHubBox = 1,
  ChaoqianFatBox = 2,
  ChaoqianFatEndBox = 3,
  ChaoqianCableType0 = 11,
  ChaoqianCableType1 = 12,
  ChaoqianCableType2 = 13,
  ChaoqianCableType3 = 14,
  ChaoqianCableType4 = 15,
  ChaoqianCableType5 = 16,
  ChaoqianONU = 30,
}

function toString(type: AreaResourceType): string {
  switch (type) {
    case AreaResourceType.ChaoqianXBox:
      return 'XBox';
    case AreaResourceType.ChaoqianHubBox:
      return 'HubBox';
    case AreaResourceType.ChaoqianFatBox:
      return 'FatBox';
    case AreaResourceType.ChaoqianFatEndBox:
      return 'FatEndBox';
    case AreaResourceType.ChaoqianCableType0:
      return '12C MPO cable';
    case AreaResourceType.ChaoqianCableType1:
      return '5mm round cable';
    case AreaResourceType.ChaoqianCableType2:
      return '3mm round cable';
    case AreaResourceType.ChaoqianCableType3:
      return '2*5 flat cable';
    case AreaResourceType.ChaoqianCableType4:
      return '1C 4*7 flat cable';
    case AreaResourceType.ChaoqianCableType5:
      return '12C 4*7 flat cable';
    case AreaResourceType.ChaoqianONU:
      return 'ONU';
    default:
      return '';
  }
}

export type LatLng={
  latitude: number;
  longitude: number;
}

export type AreaDto={
  id: number;
  name: string;
  mapZoom: number;
  status: number;
  resourceStatistics: ResourceStatistic[];
  mapRangePoints: LatLng[];
  isFloor?: boolean; // 可选属性
  floorTotal?: number; // 可选属性
}

export type AreaStatisticsQueryParam = {
  keyword?:string
}
