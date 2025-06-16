// 设备盒子类型定义
export enum BoxType {
  XBox = 'XBox',
  HubBox = 'HubBox',
  FatBox = 'FatBox',
  FatEndBox = 'FatEndBox',
  ONU = 'ONU',
  SubBox = 'SubBox',
  EndBox = 'EndBox',
}

// 端口状态
export enum BoxPortStatus {
  Unlink = 'Unlink',
  Linked = 'Linked',
  Error = 'Error',
}

// 端口类型
export enum BoxPortType {
  input = 'input',
  output = 'output',
  cascade = 'cascade',
}

// 上传文件类型
export interface UploadFile {
  id: string;
  name: string;
  url: string;
  [key: string]: any;
}

// 盒子端口
export interface ChaoqianBoxPortDto {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  boxName?: string;
  boxCode?: string;
  status: BoxPortStatus;
  type: BoxPortType;
  isOuterContainerBorderVisible?: boolean;
  cableCode?: string;
  cableLength?: number;
  oppositePortId?: number;
  oppositePortName: string;
  oppositeBoxName: string;
  orderNumber: number;
  haveCable?: boolean;
  cableTypeError?: boolean;
}

// 设备盒子
export interface ChaoqianBoxDto {
  id: number;
  areaId: number;
  code: string;
  latitude?: number;
  longitude?: number;
  opticalPowerSplittingPercentage?: number;
  address: string;
  name: string;
  type: string;
  files?: string;
  initFiles?: UploadFile[];
  yoloResult?: string;
  modifyTime?: Date;
  createUserName?: string;
  createTime?: Date;
  floor?: number;
  otherInfo?: string;
  status?: string;
  isShowFatBox?: boolean;
  chaoqianBoxPorts: ChaoqianBoxPortDto[];
  imageBytes?: Uint8Array;
}

// 光缆详情
export interface ChaoqianCableDetailDto {
  id: number;
  code: string;
  chaoqianBoxName?: string;
}

// OLT端口
export interface ChaoqianOltPortDto {
  id?: number;
  boxId?: number;
  isOuterContainerBorderVisible?: boolean;
}

// OLT设备
export interface ChaoqianOLTDto {
  id: number;
  chaoqianBoxPorts: ChaoqianOltPortDto[];
}

// 拓扑结构
export interface ChaoqianTopologyDto {
  boxes: ChaoqianBoxDto[];
  cables: ChaoqianCableDetailDto[];
}

// 编码创建
export interface CodeCreateDto {
  name: string;
  preCode: string;
  codeLength: number;
  amount?: number;
}

// 设备数据状态
export interface AreaDeviceDataState {
  parentBoxes: ChaoqianBoxDto[];
  childrenBoxes: ChaoqianBoxDto[];
  hubBoxCable: ChaoqianBoxDto[];
  oltBoxes: ChaoqianBoxDto[];
  xBoxes: ChaoqianBoxDto[];
  odcbBoxes: ChaoqianBoxDto[];
  fatBoxCable: ChaoqianBoxDto[];
  boxInfo?: ChaoqianBoxDto;
  onu?: ChaoqianBoxDto;
  showCard: boolean;
  isHaveOLT: boolean;
  showOnu: boolean;
  portStatusColor: string; // 使用CSS颜色字符串而不是Flutter的Color
  chaoqianBoxPortDto?: ChaoqianBoxPortDto;
} 