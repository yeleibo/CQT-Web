import React from 'react';
import { useModel } from '@umijs/max';
import { ChaoqianBoxDto, ChaoqianBoxPortDto } from '@/models/chaoqian';
import XBox from './boxes/XBox';

// 公共容器组件用于显示端口
interface CommonContainerProps {
  color: string;
  containerColor: string;
  statusColor: string;
  text: string;
  onTap: () => void;
}

const CommonContainer: React.FC<CommonContainerProps> = ({
  color,
  containerColor,
  statusColor,
  text,
  onTap
}) => {
  return (
    <div 
      onClick={onTap}
      style={{ 
        position: 'relative',
        cursor: 'pointer',
        marginBottom: 5
      }}
    >
      {/* 外层边框 */}
      <div 
        style={{
          width: 45,
          height: 45,
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: `2px solid ${color}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* 内层圆形 */}
        <div 
          style={{
            width: 35,
            height: 35,
            borderRadius: '50%',
            backgroundColor: containerColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span style={{ color: statusColor, fontSize: 12 }}>{text}</span>
        </div>
      </div>
    </div>
  );
};

interface XBoxDeviceProps {
  box: ChaoqianBoxDto;
}

const XBoxDevice: React.FC<XBoxDeviceProps> = ({ box }) => {
  const { 
    boxInfo, 
    groupBoxes, 
    pointPort, 
    showOutContainer 
  } = useModel('useAreaDeviceModel');
  
  // 判断是否是选中的盒子
  const isSelected = boxInfo && boxInfo.id === box.id;
  
  // 处理点击事件
  const handleClick = () => {
    groupBoxes({ boxId: box.id });
  };

  // 处理端口点击事件
  const handlePortClick = (port: ChaoqianBoxPortDto) => {
    pointPort(box, port);
    showOutContainer(box, port);
  };
  
  return (
    <div 
      style={{ 
        width: 225, 
        height: 400,
        position: 'relative',
        margin: '0 10px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div 
          
          style={{
            width: 200,
            height: 375,
            borderRadius: 20,
            border: `2px dashed ${isSelected ? '#52c41a' : '#000'}`,
            cursor: 'pointer',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 0 10px 0',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div 
            onClick={handleClick}
              style={{
      
                width: 90,
                height: 90,
                borderRadius: '50%',
                backgroundColor: isSelected ? '#52c41a' : '#f0f0f0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img 
                src="/assets/images/mini_xBox.png" 
                alt="XBox" 
                style={{ width: 70, height: 70 }} 
              />
            </div>
            
            <div style={{ margin: '5px 0', fontWeight: 'bold', fontSize: 20 }}>
              X Box
            </div>
            
            {/* 端口列表 */}
            <div style={{ 
              height: 100, 
              width: 160, 
              display: 'flex', 
              justifyContent: 'space-evenly', 
              alignItems: 'center' 
            }}>
              {box.chaoqianBoxPorts.map((port, index) => (
                <CommonContainer
                  key={port.id}
                  color={port.isOuterContainerBorderVisible ? '#3611ae' : 'transparent'}
                  containerColor={port.oppositePortId === null ? '#C0C0C0' : '#3611ae'}
                  statusColor={port.oppositePortId === null ? '#000' : '#fff'}
                  text="out"
                  onTap={() => handlePortClick(port)}
                />
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontWeight: 'bold', marginBottom: 5 }}>
              设备名称: {box.name}
            </div>
            
            <div style={{ fontWeight: 'bold' }}>
              编码: {box.code}
            </div>
          </div>
        </div>
      </div>
      
      {/* 右上角的橙色圆圈 */}
      <div 
        style={{
          position: 'absolute',
          top: 50,
          right: 0,
          width: 30,
          height: 30,
          borderRadius: '50%',
          backgroundColor: 'orange',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span style={{ color: 'white', fontSize: 16 }}></span>
      </div>
    </div>
  );
};

export default XBoxDevice; 