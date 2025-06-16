import { ChaoqianTopologyDto, BoxType, BoxPortType, BoxPortStatus } from '@/store/types';

// 创建模拟数据
export const createMockTopologyData = (): ChaoqianTopologyDto => {
  // 创建一个XBox
  const xBox = {
    id: 1,
    type: 'XBox' as BoxType,
    name: '超前XBox-1',
    code: 'X-001',
    address: '测试地址1',
    latitude: 30.123,
    longitude: 120.456,
    files: [],
    initFiles: [],
    status: 'Normal',
    areaId: 1,
    chaoqianBoxPorts: [
      {
        id: 1,
        name: '1',
        status: BoxPortStatus.Linked,
        type: BoxPortType.output,
        oppositePortId: 2,
        cableCode: 'CABLE-X-H-001',
        cableLength: 100,
        x: 50,
        y: 50,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      }
    ]
  };
  
  // 创建一个HubBox
  const hubBox = {
    id: 2,
    type: 'HubBox' as BoxType,
    name: '超前HubBox-1',
    code: 'H-001',
    address: '测试地址2',
    latitude: 30.124,
    longitude: 120.457,
    files: [],
    initFiles: [],
    status: 'Normal',
    chaoqianBoxPorts: [
      {
        id: 2,
        name: '1',
        status: BoxPortStatus.Linked,
        type: BoxPortType.input,
        oppositePortId: 1,
        cableCode: 'CABLE-X-H-001',
        cableLength: 100,
        x: 30,
        y: 30,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      },
      {
        id: 3,
        name: '2',
        status: BoxPortStatus.Linked,
        type: BoxPortType.output,
        oppositePortId: 4,
        cableCode: 'CABLE-H-F-001',
        cableLength: 50,
        x: 50,
        y: 50,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      },
      {
        id: 5,
        name: '3',
        status: BoxPortStatus.Linked,
        type: BoxPortType.output,
        oppositePortId: 6,
        cableCode: 'CABLE-H-F-002',
        cableLength: 60,
        x: 70,
        y: 50,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      },
      {
        id: 7,
        name: '4',
        status: BoxPortStatus.Unlink,
        type: BoxPortType.output,
        oppositePortId: null,
        cableCode: '',
        cableLength: 0,
        x: 90,
        y: 50,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      },
      {
        id: 8,
        name: 'C',
        status: BoxPortStatus.Unlink,
        type: BoxPortType.cascade,
        oppositePortId: null,
        cableCode: '',
        cableLength: 0,
        x: 110,
        y: 130,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      }
    ]
  };
  
  // 创建一个FatBox
  const fatBox1 = {
    id: 3,
    type: 'FatBox' as BoxType,
    name: '超前FatBox-1',
    code: 'F-001',
    address: '测试地址3',
    latitude: 30.125,
    longitude: 120.458,
    files: [],
    initFiles: [],
    status: 'Normal',
    chaoqianBoxPorts: [
      {
        id: 4,
        name: '1',
        status: BoxPortStatus.Linked,
        type: BoxPortType.input,
        oppositePortId: 3,
        cableCode: 'CABLE-H-F-001',
        cableLength: 50,
        x: 40,
        y: 50,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      },
      {
        id: 9,
        name: '1',
        status: BoxPortStatus.Linked,
        type: BoxPortType.output,
        oppositePortId: 12,
        cableCode: 'CABLE-F-O-001',
        cableLength: 30,
        x: 20,
        y: 90,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      },
      {
        id: 10,
        name: '2',
        status: BoxPortStatus.Linked,
        type: BoxPortType.output,
        oppositePortId: 13,
        cableCode: 'CABLE-F-O-002',
        cableLength: 35,
        x: 40,
        y: 90,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      },
      {
        id: 11,
        name: '3',
        status: BoxPortStatus.Unlink,
        type: BoxPortType.output,
        oppositePortId: null,
        cableCode: '',
        cableLength: 0,
        x: 60,
        y: 90,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      }
    ]
  };
  
  // 创建一个FatBox
  const fatBox2 = {
    id: 4,
    type: 'FatBox' as BoxType,
    name: '超前FatBox-2',
    code: 'F-002',
    address: '测试地址4',
    latitude: 30.126,
    longitude: 120.459,
    files: [],
    initFiles: [],
    status: 'Normal',
    chaoqianBoxPorts: [
      {
        id: 6,
        name: '1',
        status: BoxPortStatus.Linked,
        type: BoxPortType.input,
        oppositePortId: 5,
        cableCode: 'CABLE-H-F-002',
        cableLength: 60,
        x: 40,
        y: 50,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      },
      {
        id: 14,
        name: '1',
        status: BoxPortStatus.Linked,
        type: BoxPortType.output,
        oppositePortId: 16,
        cableCode: 'CABLE-F-O-003',
        cableLength: 25,
        x: 20,
        y: 90,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      },
      {
        id: 15,
        name: '2',
        status: BoxPortStatus.Unlink,
        type: BoxPortType.output,
        oppositePortId: null,
        cableCode: '',
        cableLength: 0,
        x: 40,
        y: 90,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      }
    ]
  };
  
  // 创建ONU
  const onu1 = {
    id: 5,
    type: 'ONU' as BoxType,
    name: '超前ONU-1',
    code: 'ONU-001',
    address: '用户地址1',
    latitude: 30.127,
    longitude: 120.460,
    files: [],
    initFiles: [],
    status: 'Normal',
    chaoqianBoxPorts: [
      {
        id: 12,
        name: '1',
        status: BoxPortStatus.Linked,
        type: BoxPortType.input,
        oppositePortId: 9,
        cableCode: 'CABLE-F-O-001',
        cableLength: 30,
        x: 50,
        y: 50,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      }
    ]
  };
  
  // 创建ONU
  const onu2 = {
    id: 6,
    type: 'ONU' as BoxType,
    name: '超前ONU-2',
    code: 'ONU-002',
    address: '用户地址2',
    latitude: 30.128,
    longitude: 120.461,
    files: [],
    initFiles: [],
    status: 'Normal',
    chaoqianBoxPorts: [
      {
        id: 13,
        name: '1',
        status: BoxPortStatus.Linked,
        type: BoxPortType.input,
        oppositePortId: 10,
        cableCode: 'CABLE-F-O-002',
        cableLength: 35,
        x: 50,
        y: 50,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      }
    ]
  };
  
  // 创建ONU
  const onu3 = {
    id: 7,
    type: 'ONU' as BoxType,
    name: '超前ONU-3',
    code: 'ONU-003',
    address: '用户地址3',
    latitude: 30.129,
    longitude: 120.462,
    files: [],
    initFiles: [],
    status: 'Normal',
    chaoqianBoxPorts: [
      {
        id: 16,
        name: '1',
        status: BoxPortStatus.Linked,
        type: BoxPortType.input,
        oppositePortId: 14,
        cableCode: 'CABLE-F-O-003',
        cableLength: 25,
        x: 50,
        y: 50,
        width: 20,
        height: 20,
        isOuterContainerBorderVisible: false,
      }
    ]
  };
  
  return {
    boxes: [xBox, hubBox, fatBox1, fatBox2, onu1, onu2, onu3]
  } as ChaoqianTopologyDto;
}; 