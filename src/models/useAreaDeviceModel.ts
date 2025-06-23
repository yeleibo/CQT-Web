import { useState, useCallback } from 'react';
import { BoxPortStatus, BoxPortType, ChaoqianBoxDto, ChaoqianBoxPortDto, ChaoqianTopologyDto } from './chaoqian';


// 获取端口状态颜色
function getPortStatusColor(status: BoxPortStatus): string {
  switch (status) {
    case BoxPortStatus.Linked:
      return '#4CAF50'; // 绿色
    case BoxPortStatus.Error:
      return '#F44336'; // 红色
    case BoxPortStatus.Unlinked:
    default:
      return '#9E9E9E'; // 灰色
  }
}

export default function useAreaDeviceModel() {
  // 状态定义
  const [parentBoxes, setParentBoxes] = useState<ChaoqianBoxDto[]>([]);
  const [childrenBoxes, setChildrenBoxes] = useState<ChaoqianBoxDto[]>([]);
  const [hubBoxCable, setHubBoxCable] = useState<ChaoqianBoxDto[]>([]);
  const [oltBoxes, setOltBoxes] = useState<ChaoqianBoxDto[]>([]);
  const [xBoxes, setXBoxes] = useState<ChaoqianBoxDto[]>([]);
  const [odcbBoxes, setOdcbBoxes] = useState<ChaoqianBoxDto[]>([]);
  const [fatBoxCable, setFatBoxCable] = useState<ChaoqianBoxDto[]>([]);
  const [boxInfo, setBoxInfo] = useState<ChaoqianBoxDto | undefined>(undefined);
  const [onu, setOnu] = useState<ChaoqianBoxDto | undefined>(undefined);
  const [showCard, setShowCard] = useState(false);
  const [isHaveOLT, setIsHaveOLT] = useState(false);
  const [showOnu, setShowOnu] = useState(false);
  const [portStatusColor, setPortStatusColor] = useState('black');
  const [chaoqianBoxPortDto, setChaoqianBoxPortDto] = useState<ChaoqianBoxPortDto | undefined>(undefined);
  const [topology, setTopology] = useState<ChaoqianTopologyDto | null>(null);
  
  // 辅助函数
  const singleOrDefault = useCallback(<T>(arr: T[], predicate: (item: T) => boolean): T | undefined => {
    const filtered = arr.filter(predicate);
    if (filtered.length > 1) {
      // 多个元素满足条件时应该返回undefined或抛出异常
      return undefined;
    }
    return filtered.length === 1 ? filtered[0] : undefined;
  }, []);

  const firstWhereOrNull = useCallback(<T>(arr: T[], predicate: (item: T) => boolean): T | null => {
    const filtered = arr.filter(predicate);
    return filtered.length > 0 ? filtered[0] : null;
  }, []);
  
  // 新增：类似Dart的firstOrDefault
  const firstOrDefault = useCallback(<T>(arr: T[]): T | undefined => {
    return arr.length > 0 ? arr[0] : undefined;
  }, []);
  
  // 隐藏卡片
  const hideCard = useCallback(() => {
    setShowCard(false);
  }, []);
  
  // 隐藏ONU
  const hideOnu = useCallback(() => {
    setShowOnu(false);
  }, []);
  
  // 显示连接线
  const showLine = useCallback((box: ChaoqianBoxDto) => {
    setHubBoxCable(prevHubBoxes => {
      const updatedHubBoxes = prevHubBoxes.map(hubBox => ({
        ...hubBox,
        isShowFatBox: hubBox.id === box.id
      }));
      return updatedHubBoxes;
    });
  }, []);
  
  // 隐藏连接线
  const closeLine = useCallback(() => {
    setHubBoxCable(prevHubBoxes => {
      const updatedHubBoxes = prevHubBoxes.map(hubBox => ({
        ...hubBox,
        isShowFatBox: false
      }));
      return updatedHubBoxes;
    });
  }, []);
  
  // 显示端口外层容器
  const showOutContainer = useCallback((box: ChaoqianBoxDto, portDto: ChaoqianBoxPortDto) => {
    if (box.type === 'XBox') {
      // 重置所有盒子端口的外层容器可见性
      setHubBoxCable(prevHubBoxes => {
        const updatedHubBoxes = prevHubBoxes.map(hubBox => ({
          ...hubBox,
          chaoqianBoxPorts: hubBox.chaoqianBoxPorts.map(port => ({
            ...port,
            isOuterContainerBorderVisible: false
          }))
        }));
        return updatedHubBoxes;
      });
      
      // 更新XBox端口的外层容器可见性
      setXBoxes(prevXBoxes => {
        const updatedXBoxes = prevXBoxes.map(xBox => ({
          ...xBox,
          chaoqianBoxPorts: xBox.chaoqianBoxPorts.map(port => ({
            ...port,
            isOuterContainerBorderVisible: port.id === portDto.id
          }))
        }));
        return updatedXBoxes;
      });
    } else {
      // 重置所有盒子端口的外层容器可见性
      setXBoxes(prevXBoxes => {
        const updatedXBoxes = prevXBoxes.map(xBox => ({
          ...xBox,
          chaoqianBoxPorts: xBox.chaoqianBoxPorts.map(port => ({
            ...port,
            isOuterContainerBorderVisible: false
          }))
        }));
        return updatedXBoxes;
      });
      
      // 更新HubBox端口的外层容器可见性
      setHubBoxCable(prevHubBoxes => {
        const updatedHubBoxes = prevHubBoxes.map(hubBox => ({
          ...hubBox,
          chaoqianBoxPorts: hubBox.chaoqianBoxPorts.map(port => ({
            ...port,
            isOuterContainerBorderVisible: port.id === portDto.id
          }))
        }));
        return updatedHubBoxes;
      });
    }
  }, []);
  
  // 隐藏端口外层容器
  const closeOutContainer = useCallback(() => {
    // 重置XBox端口的外层容器可见性
    setXBoxes(prevXBoxes => {
      const updatedXBoxes = prevXBoxes.map(xBox => ({
        ...xBox,
        chaoqianBoxPorts: xBox.chaoqianBoxPorts.map(port => ({
          ...port,
          isOuterContainerBorderVisible: false
        }))
      }));
      return updatedXBoxes;
    });
    
    // 重置HubBox端口的外层容器可见性
    setHubBoxCable(prevHubBoxes => {
      const updatedHubBoxes = prevHubBoxes.map(hubBox => ({
        ...hubBox,
        chaoqianBoxPorts: hubBox.chaoqianBoxPorts.map(port => ({
          ...port,
          isOuterContainerBorderVisible: false
        }))
      }));
      return updatedHubBoxes;
    });
  }, []);
  
  // 点击端口事件
  const pointPort = useCallback((box: ChaoqianBoxDto, portDto: ChaoqianBoxPortDto) => {
    if (!topology) {
      console.warn('No topology data available for pointPort');
      return;
    }
    
    const fatBoxes = topology.boxes.filter(
      element => element.type === 'FatBox' || element.type === 'FatEndBox'
    );
    const hubBoxes = topology.boxes.filter(
      element => element.type === 'HubBox'
    );
    const xBoxes = topology.boxes.filter(
      element => element.type === 'XBox'
    );
    
    hideCard();
    hideOnu();
    
    // 获取与端口相连的FatBox
    const getChildrenFatBox = (port: ChaoqianBoxPortDto, newFatBoxCable: ChaoqianBoxDto[]) => {
      if (port.oppositePortId === null) return;
      
      const boxId = port.id;
      const allFatBoxes = [...fatBoxes];
      
      const childrenBox = singleOrDefault(
        allFatBoxes,
        boxItem => boxItem.chaoqianBoxPorts.find(
          element => element.type === BoxPortType.input
        )?.oppositePortId === boxId
      );
      
      if (childrenBox) {
        newFatBoxCable.push(childrenBox);
        
        const cascadePort = childrenBox.chaoqianBoxPorts.find(
          element => element.type === BoxPortType.cascade
        );
        
        if (cascadePort) {
          getChildrenFatBox(cascadePort, newFatBoxCable);
        }
      }
    };
    
    // 获取与端口相连的HubBox
    const getChildrenHubBoxes = (port: ChaoqianBoxPortDto, newHubBoxCable: ChaoqianBoxDto[]) => {
      if (port.oppositePortId === null) return;
      
      const boxId = port.id;
      
      const childrenBox = singleOrDefault(
        hubBoxes,
        e => e.chaoqianBoxPorts.find(
          element => element.type === BoxPortType.input
        )?.oppositePortId === boxId
      );
      
      if (childrenBox) {
        newHubBoxCable.push(childrenBox);
        
        const cascadePort = childrenBox.chaoqianBoxPorts.find(
          element => element.type === BoxPortType.cascade
        );
        
        if (cascadePort) {
          getChildrenHubBoxes(cascadePort, newHubBoxCable);
        }
      }
    };
    
    // 处理XBox类型
    if (box.type === 'XBox') {
      // 隐藏所有HubBox和FatBox之间的连接线
      closeLine();
      
      const newHubBoxCable: ChaoqianBoxDto[] = [];
      const newFatBoxCable: ChaoqianBoxDto[] = [];
      
      if (portDto.oppositePortId === null) {
        setHubBoxCable(newHubBoxCable);
        setFatBoxCable(newFatBoxCable);
        return;
      }
      
      // 寻找与该出口连接的HubBox
      for (const hubBox of hubBoxes) {
        const hubBoxPort = hubBox.chaoqianBoxPorts.find(
          element => element.oppositePortId === portDto.id && element.type === BoxPortType.input
        );
        
        if (hubBoxPort) {
          newHubBoxCable.push(hubBox);
          break;
        }
      }
      
      if (newHubBoxCable.length > 0) {
        const cascadePort = newHubBoxCable[0].chaoqianBoxPorts.find(
          element => element.type === BoxPortType.cascade
        );
        
        if (cascadePort) {
          getChildrenHubBoxes(cascadePort, newHubBoxCable);
        }
      }
      
      setHubBoxCable(newHubBoxCable);
      setFatBoxCable(newFatBoxCable);
    } else {
      // 处理其他类型盒子
      const isHaveFatBox = fatBoxes.some(
        element => element.chaoqianBoxPorts.find(
          element1 => element1.type === BoxPortType.input
        )?.oppositePortId === portDto.id
      );
      
      if (portDto.type === BoxPortType.cascade || 
          portDto.type === BoxPortType.input || 
          portDto.oppositePortId === null || 
          !isHaveFatBox) {
        setFatBoxCable([]);
        closeLine();
        return;
      }
      
      if (portDto.oppositePortId !== null) {
        showLine(box);
        setChaoqianBoxPortDto(portDto);
      }
      
      const newFatBoxCable: ChaoqianBoxDto[] = [];
      
      for (const fatBox of fatBoxes) {
        if (fatBox.chaoqianBoxPorts.find(
          element => element.type === BoxPortType.input
        )?.oppositePortId === portDto.id) {
          newFatBoxCable.push(fatBox);
          break;
        }
      }
      
      if (newFatBoxCable.length > 0) {
        const cascadePort = newFatBoxCable[0].chaoqianBoxPorts.find(
          element => element.type === BoxPortType.cascade
        );
        
        if (cascadePort) {
          getChildrenFatBox(cascadePort, newFatBoxCable);
        }
      }
      
      setFatBoxCable(newFatBoxCable);
    }
  }, [singleOrDefault, topology, hideCard, hideOnu, closeLine, showLine]);
  
  // 处理分组逻辑
  const groupBoxes = useCallback(({ 
    boxId, 
    isOnu = false, 
    chaoqianTopologyDto
  }: {
    boxId: number;
    isOnu?: boolean;
    chaoqianTopologyDto?: ChaoqianTopologyDto;
  }) => {
    // 使用传入的topology或已缓存的topology
    const currentTopology = chaoqianTopologyDto || topology;
    
    // 如果没有topology数据则返回
    if (!currentTopology) {
      console.warn('No topology data available');
      return;
    }
    
    // 如果传入了新的topology，更新缓存
    if (chaoqianTopologyDto && chaoqianTopologyDto !== topology) {
      setTopology(chaoqianTopologyDto);
    }
    
    console.log('groupBoxes被调用', { boxId, isOnu });
    console.log('chaoqianTopologyDto', currentTopology);
    
    // 清除现有的分类
    const newParentBoxes: ChaoqianBoxDto[] = [];
    const newChildrenBoxes: ChaoqianBoxDto[] = [];
    const newOltBoxes: ChaoqianBoxDto[] = [];
    const newXBoxes: ChaoqianBoxDto[] = [];
    const newHubBoxCable: ChaoqianBoxDto[] = [];
    const newFatBoxCable: ChaoqianBoxDto[] = [];
    
    const hubBoxes = currentTopology.boxes.filter(element => element.type === 'HubBox');
    const fatBoxes = currentTopology.boxes.filter(element => element.type === 'FatBox' || element.type === 'FatEndBox');
    const onus = currentTopology.boxes.filter(element => element.type === 'ONU');
    
    // 选择盒子
    let selectedBox;
    if (isOnu) {
      const selectedOnu = onus.find(element => element.id === boxId);
      if (selectedOnu) {
        selectedBox = fatBoxes.find(element => element.chaoqianBoxPorts.some(
          port => port.cableCode === selectedOnu.chaoqianBoxPorts[0].cableCode
        ));
      }
    } else {
      selectedBox = currentTopology.boxes.find(element => element.id === boxId);
      console.log(selectedBox);
    }
    
    if (!selectedBox) return;
    
    // 查找父级和子级盒子
    const checkBox = (checkedBox: ChaoqianBoxDto) => {
      // 查找父级盒子的逻辑
      const getParentBox = (inport: ChaoqianBoxPortDto) => {
        const oppositePortId = inport.oppositePortId;
        if (!oppositePortId) return;
        
        const parentBox = singleOrDefault(
          currentTopology.boxes, 
          boxItem => boxItem.chaoqianBoxPorts.some(
            port => port.id === oppositePortId && port.id !== inport.id
          )
        );
        
        if (parentBox) {
          newParentBoxes.push(parentBox);
      
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
          currentTopology.boxes,
          boxItem => boxItem.chaoqianBoxPorts.some(
            port => port.oppositePortId === boxId
          ) && box.id !== boxItem.id
        );
        
        if (childrenBox) {
          newChildrenBoxes.push(childrenBox);
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
    
    // 获取HubBox级联函数
    const getHubBox = (hubBox: ChaoqianBoxDto) => {
      if (hubBox.chaoqianBoxPorts.find(
        element => element.type === BoxPortType.cascade
      )?.oppositePortId !== null) {
        const outCableCode = hubBox.chaoqianBoxPorts.find(
          element => element.type === BoxPortType.cascade
        )?.id;
        
        const index = newParentBoxes.findIndex(element => element.type === 'HubBox');
        
        for (const currentHubBox of hubBoxes) {
          if (currentHubBox.chaoqianBoxPorts.find(
            element => element.type === BoxPortType.input
          )?.oppositePortId === outCableCode) {
            newParentBoxes.splice(index, 0, currentHubBox);
            getHubBox(currentHubBox);
          }
        }
      }
    };
    
    // 处理FatBox或FatEndBox类型
    if (selectedBox.type === 'FatBox' || selectedBox.type === 'FatEndBox') {
      const hubBox = newParentBoxes.find(element => element.type === 'HubBox');
      const fatBox = newParentBoxes.filter(element => element.type === 'FatBox').length === 0
        ? selectedBox
        : newParentBoxes.filter(element => element.type === 'FatBox').pop();

      if (hubBox && fatBox) {
        // 找到与FatBox连接的HubBox端口
        const hubBoxPort = hubBox.chaoqianBoxPorts.find(element =>
          element.cableCode === fatBox.chaoqianBoxPorts
            .find(element => element.type === BoxPortType.input)?.cableCode
        );
        
        if (hubBoxPort) {
          setChaoqianBoxPortDto(selectedBox.chaoqianBoxPorts
            .find(element => element.type === BoxPortType.input));
            
          getHubBox(hubBox);
          showLine(hubBox);
          showOutContainer(hubBox, hubBoxPort);
        }
      }
    }
    
    if (selectedBox.type === 'XBox' || selectedBox.type === 'HubBox') {
      closeOutContainer();
    }
    
    // 构建显示盒子列表
    const showBoxes = [
      ...newParentBoxes.reverse(),
      selectedBox,
      ...newChildrenBoxes
    ];

    
    // 按类型归类盒子
    for (const box of showBoxes) {
      switch (box.type) {
        case 'XBox':
          newXBoxes.push(box);
          break;
        case 'HubBox':
          newHubBoxCable.push(box);
          break;
        case 'FatBox':
        case 'FatEndBox':
          newFatBoxCable.push(box);
          break;
      }
    }
    
    // 如果有FatBox，设置端口状态颜色
    if (newFatBoxCable.length > 0) {
      const portDto = newFatBoxCable[0].chaoqianBoxPorts
        .find(element => element.type === BoxPortType.input);
        
      if (portDto) {
        // 更新端口状态颜色
        setPortStatusColor(getPortStatusColor(portDto.status));
      }
    }
    
    if (selectedBox.type === 'XBox' || selectedBox.type === 'HubBox') {
      closeLine();
    }
    
    // 更新状态
    setParentBoxes(newParentBoxes);
    setChildrenBoxes(newChildrenBoxes);
    setXBoxes(newXBoxes);
    setHubBoxCable(newHubBoxCable);
    setFatBoxCable(newFatBoxCable);
    setOltBoxes(newOltBoxes);
    
    // 显示详情
    if (isOnu) {
      const selectedOnu = onus.find(element => element.id === boxId);
      if (selectedOnu) {
        setShowOnu(true);
        setOnu(selectedOnu);
        setShowCard(false);
      }
    } else {
      setShowCard(true);
      setBoxInfo(selectedBox);
      setShowOnu(false);
    }
  }, [boxInfo, singleOrDefault, firstWhereOrNull, topology, showLine, showOutContainer, closeOutContainer, closeLine]);
  
  // 显示卡片
  const showCardAction = useCallback((box: ChaoqianBoxDto) => {
    setShowCard(true);
    setBoxInfo(box);
    setShowOnu(false);
  }, []);
  
  // 显示ONU
  const showOnuAction = useCallback((onuBox: ChaoqianBoxDto) => {
    setShowOnu(true);
    setOnu(onuBox);
    setBoxInfo(undefined);
    setShowCard(false);
  }, []);
  
  return {
    parentBoxes,
    childrenBoxes,
    hubBoxCable,
    oltBoxes,
    xBoxes,
    odcbBoxes,
    fatBoxCable,
    boxInfo,
    onu,
    showCard,
    isHaveOLT,
    showOnu,
    portStatusColor,
    chaoqianBoxPortDto,
    groupBoxes,
    showCardAction,
    hideCard,
    showOnuAction,
    hideOnu,
    pointPort,
    showLine,
    closeLine,
    showOutContainer,
    closeOutContainer,
  };
}