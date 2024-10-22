import { LatLng } from '@/pages/project/type';

export type OpticalCableMonitoringModel = {
  dataCenterPoints: LatLng[];
  fiberLines: LatLng[][];
};

export enum OpticalCableMonitoringWaringState {
  Cleared = 1, // 状态1:已清除
  NotCleared = 0, // 状态0:未清除
}

export function OpticalCableMonitoringWaringStateToString(
  state: OpticalCableMonitoringWaringState,
): string {
  switch (state) {
    case OpticalCableMonitoringWaringState.Cleared:
      return '已清除';
    case OpticalCableMonitoringWaringState.NotCleared:
      return '未清除';
    default:
      return '未知状态';
  }
}

export type OpticalCableMonitoringWaringQueryParam = {
  day: number;
  state?: OpticalCableMonitoringWaringState;
};

export type OpticalCableMonitoringWarning = {
  cableName: string; // 光缆名称
  fiberCoreId?: number; // 光纤芯id
  fiberCoreName: string; // 故障纤芯名称
  // length?: number; // 故障点距离 (commented out)
  state: OpticalCableMonitoringWaringState; // 状态1:已清除，0:未清除
  createTime?: Date; // 告警发生时间
  clearedTime?: Date; // 告警恢复(清除)时间
  faultPoint?: LatLng; // 故障点
  faultPath: LatLng[][]; // 故障路径
  faultInfo?: string; // 故障信息
  cableId?: string; // 告警光路id
  startStationId?: string; // 开始站点的id
  // distFromStartStation?: number; // 距离开始站点的距离 (commented out)
  distanceFromStartStation?: number; // 距离开始站点的距离
  endStationId?: string; // 结束站点的id
  distanceFromEndStation?: number; // 距离结束站点的距离
  levelName: string; // 告警级别名称
  // levelId?: OpticalCableMonitoringWaringId; // 告警级别标识 01 断纤 02 劣化 (commented out)
  type?: string; // 告警类型名称
  id?: string; // 告警id
};
