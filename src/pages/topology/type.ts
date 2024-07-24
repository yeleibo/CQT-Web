import { CellValue } from '@/components/ExcelButton/ExportButton';
import { toStringOfDay } from '@/components/Extension/DateTime';
import { UploadFile } from 'antd';

export type ChaoqianBoxDto = {
  id: number;
  areaId: number;
  code: string;
  latitude?: number;
  longitude?: number;
  opticalPowerSplittingPercentage?: number;
  address: string;
  name: string;
  oltCode?: string;
  type: string;
  files?: string;
  yoloResult?: string;
  modifyTime?: Date;
  createUserName?: string;
  createTime?: Date;
  floor?: number;
  otherInfo?: string;
  status?: string;
  isShowFatBox?: boolean;
  chaoqianBoxPorts: ChaoqianBoxPortDto[];
  initFiles?: UploadFile[];
  imageBytes?: Uint8Array;
};

export type ChaoqianBoxPortDto = {
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

export type ChaoqianTopologyParam = {
  areaId?: number;
  boxId?: number;
  customerId?: number;
};

export const chaoqianBoxDtoHeaders: { [key: string]: CellValue<ChaoqianBoxDto> } = {
  name: (item) => item.name,
  code: (item) => item.code,
  type: (item) => item.type.toString(),
  address: (item) => item.address,
  longitude: (item) => item.longitude?.toString() ?? '',
  latitude: (item) => item.latitude?.toString() ?? '',
  modifyTime: (item) => (item.modifyTime ? toStringOfDay(item.modifyTime) : ''),
  OLTCode: (item) => item.oltCode ?? '',
  BoxPorts: (item) => {
    const ports: string[] = item.chaoqianBoxPorts.map((e) => JSON.stringify(e));
    return ports.join('\n');
  },
};

export let testData: ChaoqianBoxDto[] = [
  {
    id: 0,
    areaId: 441300,
    code: 'OLTCode',
    address: '武汉',
    name: '测试OLT',
    type: 'OLT',
    chaoqianBoxPorts: [
      {
        id: 101,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 102,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.linked,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 103,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.linked,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 104,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.error,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 105,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 106,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 107,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.linked,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 108,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
    ],
  },
  {
    id: 10,
    areaId: 441300,
    code: 'HUBBOX',
    address: '武汉',
    name: '测试HubBox',
    type: 'HubBox',
    chaoqianBoxPorts: [
      {
        id: 301,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.linked,
        type: BoxPortType.input,
        oppositePortName: '',
        oppositeBoxName: '',
        oppositePortId: 102,
        orderNumber: 0,
      },
      {
        id: 302,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.cascade,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 303,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.linked,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 304,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 305,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 306,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 307,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 308,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 309,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 310,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
    ],
  },
  {
    id: 20,
    areaId: 441300,
    code: 'SubBox',
    address: '武汉',
    name: '测试SubBox',
    type: 'SubBox',
    chaoqianBoxPorts: [
      {
        id: 1001,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.linked,
        type: BoxPortType.input,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
        oppositePortId: 303,
      },
      {
        id: 1002,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.linked,
        type: BoxPortType.cascade,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1003,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.linked,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1004,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1005,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1006,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1007,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1008,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1009,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1010,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
    ],
  },
  {
    id: 21,
    areaId: 441300,
    code: 'EndBox',
    address: '武汉',
    name: '测试EndBox',
    type: 'EndBox',
    chaoqianBoxPorts: [
      {
        id: 1011,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.linked,
        type: BoxPortType.input,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
        oppositePortId: 1002,
      },
      {
        id: 1012,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.cascade,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1013,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.linked,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1014,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1015,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1016,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1017,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1018,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1019,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
      {
        id: 1020,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.unlink,
        type: BoxPortType.output,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
      },
    ],
  },
  {
    id: 30,
    areaId: 441300,
    code: 'ONU',
    address: '武汉',
    name: '测试ONU',
    type: 'ONU',
    chaoqianBoxPorts: [
      {
        id: 2001,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.linked,
        type: BoxPortType.input,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
        oppositePortId: 1003,
      },
    ],
  },
  {
    id: 31,
    areaId: 441300,
    code: 'ONU2',
    address: '武汉',
    name: '测试ONU2',
    type: 'ONU',
    chaoqianBoxPorts: [
      {
        id: 2011,
        name: '',
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        status: BoxPortStatus.linked,
        type: BoxPortType.input,
        oppositePortName: '',
        oppositeBoxName: '',
        orderNumber: 0,
        oppositePortId: 1013,
      },
    ],
  },
];
