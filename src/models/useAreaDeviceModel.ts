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
  
  // 辅助函数
  const singleOrDefault = useCallback(<T>(arr: T[], predicate: (item: T) => boolean): T | undefined => {
    const filtered = arr.filter(predicate);
    return filtered.length > 0 ? filtered[0] : undefined;
  }, []);

  const firstWhereOrNull = useCallback(<T>(arr: T[], predicate: (item: T) => boolean): T | null => {
    const filtered = arr.filter(predicate);
    return filtered.length > 0 ? filtered[0] : null;
  }, []);
  
  // 处理分组逻辑
  const groupBoxes = useCallback(({ boxId, isOnu = false, chaoqianTopologyDto }: {
    boxId: number;
    isOnu?: boolean;
    chaoqianTopologyDto?: ChaoqianTopologyDto;
  }) => {
    if (!chaoqianTopologyDto) {
      if (boxInfo) {
        setShowCard(true);
        setBoxInfo({ ...boxInfo, id: boxId });
      }
      return;
    }
    
    // 清除现有的分类
    const newParentBoxes: ChaoqianBoxDto[] = [];
    const newChildrenBoxes: ChaoqianBoxDto[] = [];
    const newOltBoxes: ChaoqianBoxDto[] = [];
    const newXBoxes: ChaoqianBoxDto[] = [];
    const newHubBoxCable: ChaoqianBoxDto[] = [];
    const newFatBoxCable: ChaoqianBoxDto[] = [];
    
    const hubBoxes = chaoqianTopologyDto.boxes.filter(element => element.type === 'HubBox');
    const fatBoxes = chaoqianTopologyDto.boxes.filter(element => element.type === 'FatBox' || element.type === 'FatEndBox');
    const onus = chaoqianTopologyDto.boxes.filter(element => element.type === 'ONU');
    
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
      selectedBox = chaoqianTopologyDto.boxes.find(element => element.id === boxId);
    }
    
    if (!selectedBox) return;
    
    // 查找父级和子级盒子
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
          chaoqianTopologyDto.boxes,
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
        }
      }
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
  }, [boxInfo, singleOrDefault, firstWhereOrNull]);
  
  // 显示卡片
  const showCardAction = useCallback((box: ChaoqianBoxDto) => {
    setShowCard(true);
    setBoxInfo(box);
    setShowOnu(false);
  }, []);
  
  // 隐藏卡片
  const hideCard = useCallback(() => {
    setShowCard(false);
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
  };
}