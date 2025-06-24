import React from 'react';
import { useModel } from '@umijs/max';
import { BoxPortType, ChaoqianBoxDto, ChaoqianBoxPortDto } from '@/models/chaoqian';


interface HubBoxDeviceProps {
  hubBox: ChaoqianBoxDto;
  acWith: number;
  onHoverFatBox?: (fatBoxes: ChaoqianBoxDto[]) => void;
}

// 公共容器组件
const CommonContainer: React.FC<{
  text?: string;
  color?: string;
  containerColor?: string;
  statusColor?: string;
  onTap?: () => void;
  size?: number;
}> = ({ text, color = 'transparent', containerColor = '#d9d9d9', statusColor = '#000000', onTap, size = 40 }) => {
  return (
    <div
      onClick={onTap}
      style={{
        width: size,
        height: size,
        margin: 5,
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* 外层边框 - 仅当color不是transparent时显示 */}
      {color !== 'transparent' && (
        <div style={{
          position: 'absolute',
          top: -2,
          left: -2,
          width: size + 4,
          height: size + 4,
          borderRadius: '50%',
          border: `2px solid ${color}`,
          zIndex: 1
        }}></div>
      )}
      
      {/* 内层圆形 */}
      <div 
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: containerColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 0
        }}
      >
        <span style={{ color: statusColor, fontWeight: 'bold', fontSize: 14 }}>{text}</span>
      </div>
    </div>
  );
};

const HubBoxDevice: React.FC<HubBoxDeviceProps> = ({ 
  hubBox, 
  acWith,
}) => {
  const { 
    boxInfo, 
    groupBoxes, 
    pointPort, 
    showOutContainer 
  } = useModel('useAreaDeviceModel');
  
  // 是否显示线条
  const isShowLine = () => {
    // 检查是否有输入端口
    const inputPort = hubBox.chaoqianBoxPorts.find(p => p.type === BoxPortType.input);
    return inputPort && inputPort.cableCode;
  };
  
  // 获取输出端口
  const hubBoxOutputPorts = hubBox.chaoqianBoxPorts
    .filter(p => p.type === BoxPortType.output);
  
  // 获取输入端口
  const hubBoxInputPort = hubBox.chaoqianBoxPorts
    .find(p => p.type === BoxPortType.input);
  
  // 获取级联端口
  const hubBoxCascadePort = hubBox.chaoqianBoxPorts
    .find(p => p.type === BoxPortType.cascade);
  
  // 处理点击事件
  const handleBoxClick = () => {
    groupBoxes({ boxId: hubBox.id });
  };
  
  // 处理端口点击事件
  const handlePortClick = (port: ChaoqianBoxPortDto) => {
    pointPort(hubBox, port);
    showOutContainer(hubBox, port);
  };
  
  // 获取端口状态颜色
  const getPortStatusColor = (status: string) => {
    switch (status) {
      case 'Linked':
        return '#4CAF50'; // 绿色
      case 'Error':
        return '#F44336'; // 红色
      case 'Unlinked':
      default:
        return '#9E9E9E'; // 灰色
    }
  };
  
  // 判断是否是选中的盒子
  const isSelected = boxInfo && boxInfo.id === hubBox.id;
  
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      {/* 线缆信息 */}
      {isShowLine() ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              width: 150,
              height: 30,
              marginTop: 35,
              borderBottom: '2px solid #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            {hubBoxInputPort?.cableCode || ''}
          </div>
          <div
            style={{
              width: 150,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            {hubBoxInputPort?.cableLength ? `${hubBoxInputPort.cableLength}(m)` : ''}
          </div>
        </div>
      ) : (
        <div style={{ width: 150, height: 30 }}></div>
      )}
      
      {/* Hub Box 容器 */}
      <div style={{ 
        width: 225, 
        height: 400,
        position: 'relative',
        margin: '0 10px'
      }}>
        {/* 左侧绿色圆圈 */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 50,
        
          width: 30,
          height: 30,
          borderRadius: '50%',
          backgroundColor: '#47bd92',
        
        }}></div>
        
        {/* 右侧绿色圆圈 */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 50,
      
          width: 30,
          height: 30,
          borderRadius: '50%',
          backgroundColor: '#47bd92',
        
        }}></div>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <div
            style={{
              width: 200,
              height: 375,
              border: `2px dashed ${isSelected ? '#52c41a' : '#000'}`,
              borderRadius: 20,
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 0 10px 0',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* 中心图标和圆圈 */}
              <div
                onClick={handleBoxClick}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#52c41a' : '#f0f0f0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <img
                  src="/assets/images/mini_hub_box.png"
                  alt="HubBox"
                  style={{ width: 70, height: 70 }}
                />
              </div>
              
              <div
                style={{
                  margin: '5px 0',
                  fontWeight: 'bold',
                  fontSize: 20,
                }}
              >
                Hub Box
              </div>
              
              {/* 输出端口排列成2x4网格 */}
              <div style={{ 
                height: 100,
                width: 160, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* 第一行4个端口 */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {hubBoxOutputPorts.slice(0, 4).map((port, index) => (
                    <CommonContainer
                      key={port.id}
                      text={(index + 1).toString()}
                      color={port.isOuterContainerBorderVisible ? '#52c41a' : 'transparent'}
                      containerColor={index === 0 ? '#47bd92' : '#d9d9d9'}
                      statusColor={index === 0 ? '#fff' : '#000'}
                      onTap={() => handlePortClick(port)}
                      size={35}
                    />
                  ))}
                </div>
                
                {/* 第二行4个端口 */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {hubBoxOutputPorts.slice(4, 8).map((port, index) => (
                    <CommonContainer
                      key={port.id}
                      text={(index + 5).toString()}
                      color={port.isOuterContainerBorderVisible ? '#52c41a' : 'transparent'}
                      containerColor="#d9d9d9"
                      statusColor="#000"
                      onTap={() => handlePortClick(port)}
                      size={35}
                    />
                  ))}
                </div>
              </div>
              
              {/* 底部端口行 - 输入和级联 */}
              <div style={{ display: 'flex', marginTop: 5, justifyContent: 'center' }}>
                {/* 输入端口 */}
                {hubBoxInputPort && (
                  <CommonContainer
                    text="in"
                    color={hubBoxInputPort.isOuterContainerBorderVisible ? '#52c41a' : 'transparent'}
                    containerColor="#f15a25"
                    statusColor="#fff"
                    onTap={() => handlePortClick(hubBoxInputPort)}
                    size={35}
                  />
                )}
                
                {/* 级联端口 */}
                {hubBoxCascadePort && (
                  <CommonContainer
                    text="co"
                    color={hubBoxCascadePort.isOuterContainerBorderVisible ? '#52c41a' : 'transparent'}
                    containerColor="#9c27b0"
                    statusColor="#fff"
                    onTap={() => handlePortClick(hubBoxCascadePort)}
                    size={35}
                  />
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', marginBottom: 5 }}>
                设备名称: {hubBox.name}
              </div>
              <div style={{ fontWeight: 'bold' }}>
                编码: {hubBox.code}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubBoxDevice;