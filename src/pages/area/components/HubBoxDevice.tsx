import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  BoxPortType, 
  ChaoqianBoxDto, 
  ChaoqianBoxPortDto 
} from '@/store/types';
import { 
  groupBoxes, 
  setPortStatusColor, 
  setOutContainer, 
  pointPort 
} from '@/store/areaDeviceDataSlice';

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
}> = ({ text, color = 'transparent', containerColor = '#d9d9d9', statusColor = '#000000', onTap }) => {
  return (
    <div
      onClick={onTap}
      style={{
        width: 30,
        height: 30,
        margin: 2,
        cursor: 'pointer',
        position: 'relative',
        border: `1px solid ${color}`,
        backgroundColor: containerColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
      }}
    >
      <span style={{ color: statusColor, fontWeight: 'bold' }}>{text}</span>
    </div>
  );
};

const HubBoxDevice: React.FC<HubBoxDeviceProps> = ({ 
  hubBox, 
  acWith,
}) => {
  const dispatch = useAppDispatch();
  const { boxInfo } = useAppSelector(state => state.areaDeviceData);
  
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
    dispatch(groupBoxes({ boxId: hubBox.id }));
  };
  
  // 处理端口点击事件
  const handlePortClick = (port: ChaoqianBoxPortDto) => {
    dispatch(pointPort({ box: hubBox, chaoqianBoxPortDto: port }));
    dispatch(setOutContainer({ box: hubBox, chaoqianBoxPortDto: port }));
    dispatch(setPortStatusColor(port));
  };
  
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
      <div style={{ width: 225, height: 400 }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            onClick={handleBoxClick}
            style={{
              width: 200,
              height: 375,
              border: `1.5px dashed ${boxInfo?.id === hubBox.id ? '#52c41a' : '#000'}`,
              borderRadius: 20,
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 0 10px 0',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: '50%',
                  backgroundColor: boxInfo?.id === hubBox.id ? '#52c41a' : '#f0f0f0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
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
                  padding: '5px 0',
                  fontWeight: 'bold',
                  fontSize: 20,
                }}
              >
                Hub Box
              </div>
              
              <div
                style={{
                  width: 160,
                  height: 150,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* 输出端口 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 160 }}>
                  {hubBoxOutputPorts.map(port => (
                    <CommonContainer
                      key={port.id}
                      text={port.name}
                      color={port.isOuterContainerBorderVisible ? '#52c41a' : 'transparent'}
                      containerColor={port.oppositePortId ? '#47bd92' : '#d9d9d9'}
                      statusColor={port.oppositePortId ? '#fff' : '#000'}
                      onTap={() => handlePortClick(port)}
                    />
                  ))}
                </div>
                
                {/* 底部端口行 */}
                <div style={{ display: 'flex', marginTop: 10 }}>
                  {/* 输入端口 */}
                  {hubBoxInputPort && (
                    <CommonContainer
                      text={hubBoxInputPort.name}
                      color={hubBoxInputPort.isOuterContainerBorderVisible ? '#52c41a' : 'transparent'}
                      containerColor={hubBoxInputPort.oppositePortId ? '#f15a25' : '#d9d9d9'}
                      statusColor={hubBoxInputPort.oppositePortId ? '#fff' : '#000'}
                      onTap={() => handlePortClick(hubBoxInputPort)}
                    />
                  )}
                  
                  {/* 级联端口 */}
                  {hubBoxCascadePort && (
                    <CommonContainer
                      text={hubBoxCascadePort.name}
                      color={hubBoxCascadePort.isOuterContainerBorderVisible ? '#52c41a' : 'transparent'}
                      containerColor={hubBoxCascadePort.oppositePortId ? '#9c27b0' : '#d9d9d9'}
                      statusColor={hubBoxCascadePort.oppositePortId ? '#fff' : '#000'}
                      onTap={() => handlePortClick(hubBoxCascadePort)}
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 'bold', margin: '2px 0' }}>
                设备名称: {hubBox.name}
              </div>
              <div style={{ fontWeight: 'bold', margin: '2px 0' }}>
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