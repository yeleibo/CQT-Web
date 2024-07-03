import { UploadFile } from 'antd';

export type ChaoqianBoxDto = {
  id: number;
  areaId: number;
  code: string;
  latitude?: number | null;
  longitude?: number | null;
  opticalPowerSplittingPercentage?: number | null;
  address: string;
  name: string;
  type: string;
  files?: string | null;
  yoloResult?: string | null;
  modifyTime?: Date | null;
  createUserName?: string | null;
  createTime?: Date | null;
  floor?: number | null;
  otherInfo?: string | null;
  status?: string | null;
  chaoqianBoxPorts: ChaoqianBoxPortDto[];
  initFiles?: UploadFile[] | null;
  imageBytes?: Uint8Array | null;
};

export type ChaoqianBoxPortDto = {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  boxName?: string | null;
  boxCode?: string | null;
  status: BoxPortStatus;
  type: BoxPortType;
  isOuterContainerBorderVisible?: boolean | null;
  cableCode?: string | null;
  cableLength?: number | null;
  oppositePortId?: number | null;
  oppositePortName: string;
  oppositeBoxName: string;
  orderNumber: number;
  haveCable?: boolean | null;
  cableTypeError?: boolean | null;
};

export enum BoxPortType {
  /** 输入口 */
  input = 0,

  /** 输出口 */
  output = 1,

  /** 级联 */
  cascade = 2,
}

export enum BoxPortStatus {
  /** 未连接 */
  unlink = 0,

  /** 已连接 */
  linked = 1,

  /** 错误 */
  error = 2,
}

export type ChaoqianCableDetailDto = {
  id: number;
  code: string;
  chaoqianBoxName?: string;
};

export type ChaoqianTopologyDto = {
  boxes: ChaoqianBoxDto[];
  cables: ChaoqianCableDetailDto[];
};
