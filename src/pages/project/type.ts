export enum PorjectResourceType {
   XBox = 0,
   HubBox = 1,
   FatBox = 2,
   FatEndBox = 3,
   CableType0 = 11,
   CableType1 = 12,
   CableType2 = 13,
   CableType3 = 14,
   CableType4 = 15,
   CableType5 = 16,
   ONU = 30,
}

function toString(type: PorjectResourceType): string {
  switch (type) {
    case PorjectResourceType.XBox:
      return 'XBox';
    case PorjectResourceType.HubBox:
      return 'HubBox';
    case PorjectResourceType.FatBox:
      return 'FatBox';
    case PorjectResourceType.FatEndBox:
      return 'FatEndBox';
    case PorjectResourceType.CableType0:
      return '12C MPO cable';
    case PorjectResourceType.CableType1:
      return '5mm round cable';
    case PorjectResourceType.CableType2:
      return '3mm round cable';
    case PorjectResourceType.CableType3:
      return '2*5 flat cable';
    case PorjectResourceType.CableType4:
      return '1C 4*7 flat cable';
    case PorjectResourceType.CableType5:
      return '12C 4*7 flat cable';
    case PorjectResourceType.ONU:
      return 'ONU';
    default:
      return '';
  }
}

export type LatLng={
  latitude: number;
  longitude: number;
}

// 项目数据类型
export type ProjectDto ={
  id: number;
  name: string;
  mapHeight: number;
  status: string;
  resourceStatistics: ResourceStatistic[];
  mapRangePoints: LatLng[];
  isFloor?: boolean; // 可选属性
  floorTotal?: number; // 可选属性
}

export type ProjectStatisticsQueryParam = {
  keyword?:string
}

// 子类：ResourceStatistic
export type ResourceStatistic = {
  name: string;
  unit: string | null;
  value: number;
  items: ResourceStatistic[]; // 递归嵌套
};

// 子类：DailyInstallation
export type DailyInstallation = {
  id: number;
  type: string;
  name: string;
  action: string;
  code: string;
  createTime: string | null;
};

// 总类：ResourceData
export type ResourceData = {
  resourceStatistics: ResourceStatistic[];
  dailyInstallations: DailyInstallation[];
};
