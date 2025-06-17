import React from 'react';
import { useModel } from '@umijs/max';
import { 
  BoxPortType, 
  ChaoqianBoxDto, 
  ChaoqianBoxPortDto,
  BoxPortStatus
} from '@/models/chaoqian';
import { CurveListMulti } from './CurveList';


// 线条绘制组件
const MyLinePainter: React.FC<{ 
  lineColor: string;
  text?: string;
}> = ({ lineColor, text }) => {
  return (
    <div style={{ position: 'relative', height: 2, width: 50, margin: '80px 0' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          backgroundColor: lineColor,
        }}
      />
      {text && (
        <div
          style={{
            position: 'absolute',
            top: -20,
            width: '100%',
            textAlign: 'center',
            fontSize: 12,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

interface FatBoxDeviceProps {
  fatBox: ChaoqianBoxDto;
  fatBoxCable: ChaoqianBoxDto[];
  onus: ChaoqianBoxDto[];
  onTap?: () => void;
}

interface ONUDetailProps {
  chaoqianBoxPortDto: ChaoqianBoxPortDto[];
  onus: ChaoqianBoxDto[];
}

// ONU端口详情组件
const ONUDetail: React.FC<ONUDetailProps> = ({ chaoqianBoxPortDto, onus }) => {
  const { showOnuAction } = useModel('useAreaDeviceModel');
  
  // 处理ONU点击
  const handleOnuClick = (port: ChaoqianBoxPortDto) => {
    if (!port.oppositePortId || onus.length === 0) return;
    
    const onu = onus.find(
      e => e.chaoqianBoxPorts[0]?.oppositePortId === port.id
    );
    
    if (onu) {
      showOnuAction(onu);
    }
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* 使用曲线绘制器 */}
      <CurveListMulti chaoqianBoxPortDto={chaoqianBoxPortDto} showONU={true} />
      
      {/* ONU端口指示图标 */}
      <div style={{ width: 500, display: 'flex', justifyContent: 'space-evenly', padding: '0 10px' }}>
        {chaoqianBoxPortDto.map((port, index) => {
          // 检查是否有链接的ONU设备
          let isLinkError = false;
          let config;
          
          if (port.oppositePortId != null) {
            const onu = onus.find(
              e => e.chaoqianBoxPorts[0]?.oppositePortId === port.id
            );
            isLinkError = onu?.chaoqianBoxPorts[0]?.status === BoxPortStatus.Error;
            config = onu?.status;
          }
          
          return port.oppositePortId != null ? (
            <div
              key={port.id}
              onClick={() => handleOnuClick(port)}
              style={{ 
                width: 30, 
                height: 30, 
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <img
                src="/assets/images/chaoqian/fiber.png"
                alt="fiber"
                width={30}
                height={30}
                style={{ 
                  filter: isLinkError
                    ? 'invert(13%) sepia(95%) saturate(6932%) hue-rotate(358deg) brightness(90%) contrast(114%)'
                    : config === 'UnConfigured'
                    ? 'invert(50%)'
                    : 'invert(42%) sepia(93%) saturate(1352%) hue-rotate(87deg) brightness(119%) contrast(73%)'
                }}
              />
            </div>
          ) : (
            <div key={`empty-${index}`} style={{ width: 30, height: 30 }} />
          );
        })}
      </div>
    </div>
  );
};

const FatBoxDevice: React.FC<FatBoxDeviceProps> = ({
  fatBox,
  fatBoxCable,
  onus,
  onTap,
}) => {
  const { boxInfo, groupBoxes } = useModel('useAreaDeviceModel');
  
  // 获取FatBox的输出端口
  const getOutputPorts = (box: ChaoqianBoxDto): ChaoqianBoxPortDto[] => {
    // 先过滤符合条件的元素
    const filteredList = box.chaoqianBoxPorts.filter(
      e => e.type === BoxPortType.output
    );
    
    // 再进行排序
    return [...filteredList].sort((x, y) => parseInt(x.name) - parseInt(y.name));
  };
  
  // 处理点击事件
  const handleClick = () => {
    groupBoxes({ boxId: fatBox.id });
    if (onTap) onTap();
  };
  
  // 获取输入端口
  const inputPort = fatBox.chaoqianBoxPorts.find(
    port => port.type === BoxPortType.input
  );
  
  // 获取输出端口
  const outputPorts = getOutputPorts(fatBox);
  
  // 是否是第一个FatBox
  const isFirstFatBox = fatBox === fatBoxCable[0];
  
  // 获取端口状态颜色
  const getPortStatusColor = (status: BoxPortStatus) => {
    switch (status) {
      case BoxPortStatus.Error:
        return 'red';
      case BoxPortStatus.Linked:
        return 'green';
      default:
        return 'black';
    }
  };
  
  return (
    <div style={{ margin: '80px 0 0 0' }}>
      {isFirstFatBox ? (
        // 第一个FatBox显示为中央对齐的布局
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* 盒子容器 */}
          <div
            onClick={handleClick}
            style={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              border: `1px solid ${
                inputPort?.status === BoxPortStatus.Error ? 'red' : 'green'
              }`,
              backgroundColor: boxInfo?.id === fatBox.id ? '#52c41a' : 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <img
              src="/assets/images/mini_fat_box.png"
              alt="FatBox"
              width={70}
              height={70}
            />
          </div>
          
          {/* 盒子名称和编码 */}
          <div style={{ marginTop: 5, fontSize: 20, fontWeight: 'bold' }}>
            {fatBox.name}
          </div>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>
            {fatBox.code}
          </div>
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>
            {fatBox.type}
          </div>
          
          {/* ONU端口详情 */}
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
            <ONUDetail
              chaoqianBoxPortDto={outputPorts}
              onus={onus}
            />
          </div>
        </div>
      ) : (
        // 其他FatBox显示为行布局
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {/* 连接线 */}
          <MyLinePainter
            lineColor={
              inputPort?.status === BoxPortStatus.Error ? 'red' : 'green'
            }
            text={`${inputPort?.cableLength || ''}(m)`}
          />
          
          {/* FatBox列布局 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* 盒子容器 */}
            <div
              onClick={handleClick}
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                border: `1px solid ${
                  inputPort?.status === BoxPortStatus.Error ? 'red' : 'green'
                }`,
                backgroundColor: boxInfo?.id === fatBox.id ? '#52c41a' : 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <img
                src="/assets/images/mini_fat_box.png"
                alt="FatBox"
                width={70}
                height={70}
              />
            </div>
            
            {/* 盒子名称和编码 */}
            <div style={{ marginTop: 5, fontSize: 20, fontWeight: 'bold' }}>
              {fatBox.name}
            </div>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>
              {fatBox.code}
            </div>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>
              {fatBox.type}
            </div>
            
            {/* ONU端口详情 */}
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
              <ONUDetail
                chaoqianBoxPortDto={outputPorts}
                onus={onus}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FatBoxDevice; 