import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  AreaDeviceDataState, 
  BoxPortType, 
  BoxPortStatus, 
  ChaoqianBoxDto, 
  ChaoqianBoxPortDto,
  ChaoqianTopologyDto
} from './types';
import { createAction } from '@reduxjs/toolkit';

// 初始状态
const initialState: AreaDeviceDataState = {
  parentBoxes: [],
  childrenBoxes: [],
  hubBoxCable: [],
  oltBoxes: [],
  xBoxes: [],
  odcbBoxes: [],
  fatBoxCable: [],
  showCard: false,
  isHaveOLT: false,
  showOnu: false,
  portStatusColor: 'black',
};

// 辅助函数
const singleOrDefault = <T>(arr: T[], predicate: (item: T) => boolean): T | undefined => {
  const filtered = arr.filter(predicate);
  return filtered.length > 0 ? filtered[0] : undefined;
};

const firstWhereOrNull = <T>(arr: T[], predicate: (item: T) => boolean): T | null => {
  const filtered = arr.filter(predicate);
  return filtered.length > 0 ? filtered[0] : null;
};

export const areaDeviceDataSlice = createSlice({
  name: 'areaDeviceData',
  initialState,
  reducers: {
    // 对应原来的GroupBoxesEvent
    groupBoxes: (state, action: PayloadAction<{ 
      boxId: number; 
      isOnu?: boolean; 
      chaoqianTopologyDto?: ChaoqianTopologyDto 
    }>) => {
      const { boxId, isOnu = false, chaoqianTopologyDto } = action.payload;
      
      // 如果没有提供chaoqianTopologyDto，则只更新选中状态
      if (!chaoqianTopologyDto) {
        if (state.boxInfo) {
          state.showCard = true;
          state.boxInfo = { ...state.boxInfo, id: boxId };
        }
        return;
      }
      
      // 清除现有的分类
      state.parentBoxes = [];
      state.childrenBoxes = [];
      state.oltBoxes = [];
      state.xBoxes = [];
      state.hubBoxCable = [];
      state.fatBoxCable = [];
      
      const hubBoxes = chaoqianTopologyDto.boxes
        .filter(element => element.type === 'HubBox');
      const fatBoxes = chaoqianTopologyDto.boxes
        .filter(element => element.type === 'FatBox' || element.type === 'FatEndBox');
      const onus = chaoqianTopologyDto.boxes
        .filter(element => element.type === 'ONU');
      
      // 选择盒子
      let selectedBox;
      if (isOnu) {
        const onu = onus.find(element => element.id === boxId);
        if (onu) {
          selectedBox = fatBoxes.find(element => element.chaoqianBoxPorts.some(
            port => port.cableCode === onu.chaoqianBoxPorts[0].cableCode
          ));
        }
      } else {
        selectedBox = chaoqianTopologyDto.boxes.find(element => element.id === boxId);
      }
      
      if (!selectedBox) return;
      
      // 执行checkBox函数以查找盒子的层次关系
      // 这里我们直接在reducer中实现这个逻辑
      const checkBox = (checkedBox: ChaoqianBoxDto) => {
        // 查找父级盒子的逻辑
        const getParentBox = (inport: ChaoqianBoxPortDto) => {
          const oppositePortId = inport.oppositePortId;
          if (!oppositePortId) return;
          
          const parentBox = singleOrDefault(
            chaoqianTopologyDto.boxes, 
            boxItem => boxItem.chaoqianBoxPorts.some(
              port => port.id === oppositePortId && port.id !== inport.id
            )
          );
          
          if (parentBox) {
            state.parentBoxes.push(parentBox);
            
            // XBox类型没有上一级
            if (parentBox.type === 'XBox') {
              return;
            } else {
              const inputPort = parentBox.chaoqianBoxPorts.find(
                element => element.type === BoxPortType.input
              );
              if (inputPort?.oppositePortId) {
                getParentBox(inputPort);
              }
            }
          }
        };
        
        // 查找子级盒子的逻辑
        const getChildrenBox = (box: ChaoqianBoxDto) => {
          if (box.type === 'FatEndBox' || box.type === 'XBox') {
            return;
          }
          
          const cascadePort = box.chaoqianBoxPorts.find(
            element => element.type === BoxPortType.cascade
          );
          
          if (!cascadePort || !cascadePort.oppositePortId) {
            return;
          }
          
          const boxId = cascadePort.id;
          const childrenBox = singleOrDefault(
            chaoqianTopologyDto.boxes,
            boxItem => boxItem.chaoqianBoxPorts.some(
              port => port.oppositePortId === boxId
            ) && box.id !== boxItem.id
          );
          
          if (childrenBox) {
            state.childrenBoxes.push(childrenBox);
            getChildrenBox(childrenBox);
          }
        };
        
        // 处理输入端口
        const input1 = firstWhereOrNull(
          checkedBox.chaoqianBoxPorts,
          element => element.oppositePortId !== null && element.type === BoxPortType.input
        );
        
        if (input1) {
          getParentBox(input1);
        }
        
        // 处理级联端口
        getChildrenBox(checkedBox);
      };
      
      // 执行checkBox
      checkBox(selectedBox);
      
      // 处理FatBox或FatEndBox类型
      if (selectedBox.type === 'FatBox' || selectedBox.type === 'FatEndBox') {
        const hubBox = state.parentBoxes.find(element => element.type === 'HubBox');
        const fatBox = state.parentBoxes.filter(element => element.type === 'FatBox').length === 0
          ? selectedBox
          : state.parentBoxes.filter(element => element.type === 'FatBox').pop();

        if (hubBox && fatBox) {
          // 找到与FatBox连接的HubBox端口
          const hubBoxPort = hubBox.chaoqianBoxPorts.find(element =>
            element.cableCode === fatBox.chaoqianBoxPorts
              .find(element => element.type === BoxPortType.input)?.cableCode
          );
          
          if (hubBoxPort) {
            state.chaoqianBoxPortDto = selectedBox.chaoqianBoxPorts
              .find(element => element.type === BoxPortType.input);
          }
        }
      }
      
      // 构建显示盒子列表
      const showBoxes = [
        ...state.parentBoxes.reverse(),
        selectedBox,
        ...state.childrenBoxes
      ];
      
      // 按类型归类盒子
      for (const box of showBoxes) {
        switch (box.type) {
          case 'XBox':
            state.xBoxes.push(box);
            break;
          case 'HubBox':
            state.hubBoxCable.push(box);
            break;
          case 'FatBox':
          case 'FatEndBox':
            state.fatBoxCable.push(box);
            break;
        }
      }
      
      // 如果有FatBox，设置端口状态颜色
      if (state.fatBoxCable.length > 0) {
        const portDto = state.fatBoxCable[0].chaoqianBoxPorts
          .find(element => element.type === BoxPortType.input);
          
        if (portDto) {
          // 更新端口状态颜色
          state.portStatusColor = getPortStatusColor(portDto.status);
        }
      }
      
      // 显示详情
      if (isOnu) {
        const onu = onus.find(element => element.id === boxId);
        if (onu) {
          state.showOnu = true;
          state.onu = onu;
          state.showCard = false;
        }
      } else {
        state.showCard = true;
        state.boxInfo = selectedBox;
        state.showOnu = false;
      }
    },
    
    // 显示卡片
    showCard: (state, action: PayloadAction<ChaoqianBoxDto>) => {
      state.showCard = true;
      state.boxInfo = action.payload;
      state.showOnu = false;
    },
    
    // 隐藏卡片
    hideCard: (state) => {
      state.showCard = false;
    },
    
    // 显示ONU
    showOnu: (state, action: PayloadAction<ChaoqianBoxDto>) => {
      state.showOnu = true;
      state.onu = action.payload;
      state.showCard = false;
    },
    
    // 隐藏ONU
    hideOnu: (state) => {
      state.showOnu = false;
    },
    
    // 点击端口事件
    pointPort: (state, action: PayloadAction<{
      box: ChaoqianBoxDto;
      chaoqianBoxPortDto: ChaoqianBoxPortDto;
      chaoqianTopologyDto?: ChaoqianTopologyDto;
    }>) => {
      const { box, chaoqianBoxPortDto, chaoqianTopologyDto } = action.payload;
      
      // 如果没有拓扑数据，只显示盒子信息
      if (!chaoqianTopologyDto) {
        state.showCard = true;
        state.boxInfo = box;
        return;
      }
      
      const fatBoxes = chaoqianTopologyDto.boxes
        .filter(element => element.type === 'FatBox' || element.type === 'FatEndBox');
      const hubBoxes = chaoqianTopologyDto.boxes
        .filter(element => element.type === 'HubBox');
      
      // 隐藏详情
      state.showCard = false;
      state.showOnu = false;
      
      // 处理XBox类型
      if (box.type === 'XBox') {
        // 清除现有连接
        state.hubBoxCable = [];
        state.fatBoxCable = [];
        
        if (!chaoqianBoxPortDto.oppositePortId) return;
        
        // 查找与端口连接的HubBox
        for (const hubBox of hubBoxes) {
          const hubPort = hubBox.chaoqianBoxPorts.find(
            element => element.oppositePortId === chaoqianBoxPortDto.id && 
                      element.type === BoxPortType.input
          );
          
          if (hubPort) {
            state.hubBoxCable.push(hubBox);
            break;
          }
        }
        
        // 找到连接到的HubBox后，再递归查找下级HubBox
        if (state.hubBoxCable.length > 0) {
          const getChildrenHubBoxes = (portDto: ChaoqianBoxPortDto) => {
            if (!portDto.oppositePortId) return;
            
            const boxId = portDto.id;
            const childrenBox = hubBoxes.find(box => 
              box.chaoqianBoxPorts.some(
                port => port.oppositePortId === boxId &&
                       port.type === BoxPortType.input
              )
            );
            
            if (childrenBox) {
              state.hubBoxCable.push(childrenBox);
              const cascadePort = childrenBox.chaoqianBoxPorts.find(
                element => element.type === BoxPortType.cascade
              );
              if (cascadePort) {
                getChildrenHubBoxes(cascadePort);
              }
            }
          };
          
          const lastHubBox = state.hubBoxCable[state.hubBoxCable.length - 1];
          const cascadePort = lastHubBox.chaoqianBoxPorts.find(
            element => element.type === BoxPortType.cascade
          );
          
          if (cascadePort) {
            getChildrenHubBoxes(cascadePort);
          }
        }
      } else {
        // 处理HubBox类型
        const isHaveFatBox = fatBoxes.some(box => 
          box.chaoqianBoxPorts.find(
            port => port.type === BoxPortType.input
          )?.oppositePortId === chaoqianBoxPortDto.id
        );
        
        // 不符合条件则清除并返回
        if (chaoqianBoxPortDto.type === BoxPortType.cascade || 
            chaoqianBoxPortDto.type === BoxPortType.input || 
            !chaoqianBoxPortDto.oppositePortId || 
            !isHaveFatBox) {
          state.fatBoxCable = [];
          return;
        }
        
        // 更新端口状态
        state.chaoqianBoxPortDto = chaoqianBoxPortDto;
        
        // 清除然后重新查找FatBox
        state.fatBoxCable = [];
        
        for (const fatBox of fatBoxes) {
          if (fatBox.chaoqianBoxPorts.find(
              port => port.type === BoxPortType.input
            )?.oppositePortId === chaoqianBoxPortDto.id) {
            state.fatBoxCable.push(fatBox);
            break;
          }
        }
        
        // 如果找到FatBox，递归查找下级FatBox
        if (state.fatBoxCable.length > 0) {
          const getChildrenFatBox = (portDto: ChaoqianBoxPortDto) => {
            if (!portDto.oppositePortId) return;
            
            const boxId = portDto.id;
            const childrenBox = fatBoxes.find(box => 
              box.chaoqianBoxPorts.find(
                port => port.type === BoxPortType.input
              )?.oppositePortId === boxId
            );
            
            if (childrenBox) {
              state.fatBoxCable.push(childrenBox);
              const cascadePort = childrenBox.chaoqianBoxPorts.find(
                port => port.type === BoxPortType.cascade
              );
              if (cascadePort) {
                getChildrenFatBox(cascadePort);
              }
            }
          };
          
          const lastFatBox = state.fatBoxCable[state.fatBoxCable.length - 1];
          const cascadePort = lastFatBox.chaoqianBoxPorts.find(
            port => port.type === BoxPortType.cascade
          );
          
          if (cascadePort) {
            getChildrenFatBox(cascadePort);
          }
        }
      }
    },
    
    // 显示/隐藏连接线
    showLine: (state, action: PayloadAction<ChaoqianBoxDto>) => {
      const box = action.payload;
      state.hubBoxCable = state.hubBoxCable.map(hubBox => ({
        ...hubBox,
        isShowFatBox: hubBox.id === box.id
      }));
    },
    
    closeLine: (state) => {
      state.hubBoxCable = state.hubBoxCable.map(hubBox => ({
        ...hubBox,
        isShowFatBox: false
      }));
    },
    
    // 显示端口外层容器
    showOutContainer: (state, action: PayloadAction<{
      box: ChaoqianBoxDto; 
      chaoqianBoxPortDto: ChaoqianBoxPortDto;
    }>) => {
      const { box, chaoqianBoxPortDto } = action.payload;
      
      if (box.type === 'XBox') {
        // 重置所有HubBox端口样式
        state.hubBoxCable = state.hubBoxCable.map(hubBox => ({
          ...hubBox,
          chaoqianBoxPorts: hubBox.chaoqianBoxPorts.map(port => ({
            ...port,
            isOuterContainerBorderVisible: false
          }))
        }));
        
        // 设置XBox端口样式
        state.xBoxes = state.xBoxes.map(xbox => ({
          ...xbox,
          chaoqianBoxPorts: xbox.chaoqianBoxPorts.map(port => ({
            ...port,
            isOuterContainerBorderVisible: port.id === chaoqianBoxPortDto.id
          }))
        }));
      } else {
        // 重置所有XBox端口样式
        state.xBoxes = state.xBoxes.map(xbox => ({
          ...xbox,
          chaoqianBoxPorts: xbox.chaoqianBoxPorts.map(port => ({
            ...port,
            isOuterContainerBorderVisible: false
          }))
        }));
        
        // 设置HubBox端口样式
        state.hubBoxCable = state.hubBoxCable.map(hubBox => ({
          ...hubBox,
          chaoqianBoxPorts: hubBox.chaoqianBoxPorts.map(port => ({
            ...port,
            isOuterContainerBorderVisible: port.id === chaoqianBoxPortDto.id
          }))
        }));
      }
    },
    
    // 关闭外层容器
    closeOutContainer: (state) => {
      // 重置所有XBox端口样式
      state.xBoxes = state.xBoxes.map(xbox => ({
        ...xbox,
        chaoqianBoxPorts: xbox.chaoqianBoxPorts.map(port => ({
          ...port,
          isOuterContainerBorderVisible: false
        }))
      }));
      
      // 重置所有HubBox端口样式
      state.hubBoxCable = state.hubBoxCable.map(hubBox => ({
        ...hubBox,
        chaoqianBoxPorts: hubBox.chaoqianBoxPorts.map(port => ({
          ...port,
          isOuterContainerBorderVisible: false
        }))
      }));
    },
    
    // 更新端口状态颜色
    updatePortStatusColor: (state, action: PayloadAction<ChaoqianBoxPortDto>) => {
      state.portStatusColor = getPortStatusColor(action.payload.status);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setPortStatusColor, (state, action) => {
        state.portStatusColor = action.payload.status === 'Error' ? 'red' : 'black';
      })
      .addCase(setOutContainer, (state, action) => {
        const { box, chaoqianBoxPortDto } = action.payload;
        // 更新所有端口的isOuterContainerBorderVisible为false
        state.parentBoxes.forEach(parentBox => {
          parentBox.chaoqianBoxPorts.forEach(port => {
            port.isOuterContainerBorderVisible = false;
          });
        });
        
        // 设置当前端口的isOuterContainerBorderVisible为true
        const currentBox = state.parentBoxes.find(b => b.id === box.id);
        if (currentBox) {
          const currentPort = currentBox.chaoqianBoxPorts.find(p => p.id === chaoqianBoxPortDto.id);
          if (currentPort) {
            currentPort.isOuterContainerBorderVisible = true;
          }
        }
      })
      .addCase(pointPort, (state, action) => {
        const { box } = action.payload;
        // 显示盒子信息卡片
        state.showCard = true;
        state.boxInfo = box;
      });
  }
});

// 辅助函数：获取端口状态颜色
function getPortStatusColor(status: BoxPortStatus): string {
  switch(status) {
    case BoxPortStatus.Linked:
      return 'green';
    case BoxPortStatus.Error:
      return 'red';
    default:
      return 'black';
  }
}

// 导出Action创建器
export const { 
  groupBoxes, 
  showCard, 
  hideCard, 
  showOnu, 
  hideOnu, 
  pointPort, 
  showLine, 
  closeLine, 
  showOutContainer, 
  closeOutContainer, 
  updatePortStatusColor 
} = areaDeviceDataSlice.actions;

// 添加新的action
export const setPortStatusColor = createAction<ChaoqianBoxPortDto>('areaDeviceData/setPortStatusColor');
export const setOutContainer = createAction<{ box: ChaoqianBoxDto, chaoqianBoxPortDto: ChaoqianBoxPortDto }>('areaDeviceData/setOutContainer');

// 导出Reducer
export default areaDeviceDataSlice.reducer; 