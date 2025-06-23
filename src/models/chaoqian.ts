// 盒子端口类型枚举
export enum BoxPortType {
  input = 0,
  output = 1,
  cascade = 2
}

// 盒子端口状态枚举
export enum BoxPortStatus {
  Linked = 'Linked',
  Error = 'Error',
  Unlinked = 'Unlinked'
}

// 文件信息接口
export interface FileInfo {
  url: string;
  name: string;
}

// 盒子端口数据接口
export interface ChaoqianBoxPortDto {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  boxName?: string;
  boxCode?: string;
  type: BoxPortType;
  status: BoxPortStatus;
  cableCode?: string;
  cableLength?: number;
  oppositePortId?: number;
  orderNumber: number;
  oppositePortName: string;
  oppositeBoxName:string;
  haveCable?: boolean;
  cableTypeError?: boolean;
  isOuterContainerBorderVisible: boolean;
}

// 盒子数据接口
export interface ChaoqianBoxDto {
  id: number;
  name: string;
  code: string;
  type: string; // 'XBox' | 'HubBox' | 'FatBox' | 'FatEndBox' | 'ONU'
  latitude: number;
  longitude: number;
  address: string;
  createUserName: string;
  status: string;
  chaoqianBoxPorts: ChaoqianBoxPortDto[];
  files: FileInfo[] | null;
  initFiles: FileInfo[] | null;
  isShowFatBox: boolean;
}

// 拓扑数据接口
export interface ChaoqianTopologyDto {
  boxes: ChaoqianBoxDto[];
} 