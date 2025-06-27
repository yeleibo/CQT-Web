export type DataVisualizationModel = {
  ///资源统计模型
  resourceStaticModelList: ResourceStaticModel[];
  engineeringStaticsByOrganize: EngineeringStaticsByOrganize[];
  engineeringList: EngineeringModel[];
  mapInfoModel: MapInfoModel;
};


export type ResourceStaticModel = {
  name: string;
  totalAmount: number;
  unitName: string;
  item: ResourceStaticItemModel[];
};

export type ResourceStaticItemModel = {
  name: string;
  amount: number;
  percent: number;
};

///工程区域统计模型
export type EngineeringStaticsByOrganize = {
  organizeName: string;
  totalAmount: number;
  finishedAmount: number;
};

///工程统计模型
export type EngineeringModel = {
  organizeName: string;
  percentCompleted: number;
};

export type MapInfoModel = {
  dataCenterPoints: [];
  fiberLines: [];
};

// export type OpticalCableMonitoringWaringModel = {
//   cableName: string;
//   fiberCoreId?: number;
//   fiberCoreName: string;
//   state: OpticalCableMonitoringWaringState;
//   createTime?: Date;
//   clearedTime?: Date;
//   faultPoint?: LatLng;
//   faultPath: LatLng[][];
//   faultInfo?: string;
//   cableId?: string;
//   startStationId?: string;
//   distanceFromStartStation?: number;
//   endStationId?: string;
//   distanceFromEndStation?: number;
//   levelName: string;
//   type?: string;
//   id?: string;
// };


enum OpticalCableMonitoringWaringState {
  uncleared = 0, // Dart @JsonValue(0)
  cleared = 1, // Dart @JsonValue(1)
}

// 添加一个辅助函数来获取枚举值的描述
export function getOpticalCableMonitoringWaringStateDescription(
  state: OpticalCableMonitoringWaringState,
): string {
  switch (state) {
    case OpticalCableMonitoringWaringState.cleared:
      return '已清除';
    case OpticalCableMonitoringWaringState.uncleared:
      return '未清除';
    default:
      return ''; // 可选的默认情况
  }
}

export const resourceData: ResourceStaticModel = {
  name: '光纤资源管理 ',
  totalAmount: 5148.06,
  unitName: '千米 ',
  item: [
    {
      name: '钟管分公司',
      amount: 820.36,
      percent: 15,
    },
    {
      name: '武康分公司',
      amount: 2081.15,
      percent: 40,
    },
    {
      name: '乾元分公司',
      amount: 1044.74,
      percent: 20,
    },
    {
      name: '新市分公司',
      amount: 1198.41,
      percent: 23,
    },
    {
      name: '其他',
      amount: 3,
      percent: 2,
    },
  ],
};
enum CableState {
  Normal = 'Normal',
  Warning = 'Warning',
  Critical = 'Critical',
}
interface CableData {
  state: CableState;
  cableName: string;
}

export const cableData: CableData[] = [
  { state: CableState.Normal, cableName: 'YBGC-莫干山镇燎原村安置二期管道地...' },
  { state: CableState.Warning, cableName: 'YBGC-新市镇新联路建设涉及广电线路...' },
  { state: CableState.Critical, cableName: 'YBGC-新市镇河东路明德机械制造南门...' },
  { state: CableState.Normal, cableName: 'FCGC-莫干山镇安置房项目广电接入工程' },
  { state: CableState.Warning, cableName: 'YBGC-阜溪街道英溪北路（环城北路至...' },
  { state: CableState.Critical, cableName: 'YBGC-新市镇谢家园路建设涉及广电线...' },
  { state: CableState.Normal, cableName: 'JKGC-康乾街道新琪村监控工程' },
  { state: CableState.Warning, cableName: 'YBGC-阜溪街道纬六路广电地埋管道工程' },
  {
    state: CableState.Critical,
    cableName: 'YBGC-武康街道灵山街（岭头路-莫干山镇安置房项目广电接入工程',
  },
  { state: CableState.Critical, cableName: 'YBGC-武康街道灵山街（岭头路-联合123141ddddd241' },
  {
    state: CableState.Critical,
    cableName: 'YBGC-武康街道灵山街（岭头路-莫干山镇安置房项目广电接入工程',
  },
  { state: CableState.Critical, cableName: 'YBGC-武康街道灵山街（岭头路-联合12314dddd1241' },
  { state: CableState.Critical, cableName: 'YBGC-武康街道灵山街（岭头路-联合12314dddd1241' },
  {
    state: CableState.Critical,
    cableName: 'YBGC-武康街道灵山街（岭头路-莫干山镇安置房项目广电接入工程',
  },
  { state: CableState.Critical, cableName: 'YBGC-武康街道灵山街（岭头路-联合12314asdasdasd241' },
];
export const barChartData: EngineeringStaticsByOrganize[] = [
  { organizeName: '武康分公司', totalAmount: 209, finishedAmount: 199 },
  { organizeName: '千元分公司', totalAmount: 44, finishedAmount: 43 },
  { organizeName: '新市分公司', totalAmount: 137, finishedAmount: 133 },
  { organizeName: '中观分公司', totalAmount: 85, finishedAmount: 83 },
  { organizeName: '工程规划部', totalAmount: 13, finishedAmount: 12 },
  { organizeName: '项目运维部', totalAmount: 13, finishedAmount: 12 },
];
