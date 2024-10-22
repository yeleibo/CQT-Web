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

interface LatLng {
  latitude: number;
  longitude: number;
}

enum OpticalCableMonitoringWaringState {
  uncleared = 0, // Dart @JsonValue(0)
  cleared = 1, // Dart @JsonValue(1)
}

// 添加一个辅助函数来获取枚举值的描述
function getOpticalCableMonitoringWaringStateDescription(
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
