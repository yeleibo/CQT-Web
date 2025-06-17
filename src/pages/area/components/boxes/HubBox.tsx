import React, { useRef, useEffect, useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import { ChaoqianBoxPortDto, BoxPortType } from '@/models/chaoqian';
import BoxPortWidget from './BoxPortWidget';
import { checkBoxPortCableCode, PortColor, getPortColor } from './chaoqianStringExtension';

// 扩展ChaoqianBoxPortDto接口，添加Flutter版本中使用的属性
interface ExtendedBoxPortDto extends ChaoqianBoxPortDto {
  x: number;
  y: number;
  width: number;
  boxName?: string;
}

interface HubBoxProps {
  chaoqianBoxPorts: ExtendedBoxPortDto[];
  onChange?: (name: string, code: string | null, oppositePortId?: number | null, boxName?: string | null) => void;
  codeChangeFunction?: () => Promise<string | null>;
  isSelect?: boolean;
}

const HubBox: React.FC<HubBoxProps> = ({ 
  chaoqianBoxPorts, 
  onChange, 
  codeChangeFunction,
  isSelect = false 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.offsetHeight;
        setContainerSize({ width, height });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);
  
  const handleCodeChange = (code: string | null, name: string) => {
    if (code === null || checkBoxPortCableCode(code, "HubBox", name)) {
      onChange?.(name, code);
    } else {
      message.error("The cable type is incorrect");
    }
  };
  
  const showColorInfoModal = () => {
    Modal.info({
      title: 'Port Colors Information',
      width: 500,
      content: (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.values(PortColor).map(color => (
            <div key={color as string} style={{ width: 80, padding: '15px 0', textAlign: 'center' }}>
              <div style={{ 
                width: 30, 
                height: 30, 
                backgroundColor: getPortColor(color as PortColor), 
                borderRadius: 15,
                margin: '0 auto' 
              }} />
              <div>{color}</div>
            </div>
          ))}
        </div>
      ),
    });
  };
  
  // 选择盒子的处理函数
  const handlePortTap = async (port: ExtendedBoxPortDto) => {
    if (port.type === BoxPortType.input) {
      // 在实际应用中，这里应该打开一个盒子选择界面
      // 这里简化为直接调用onChange
      onChange?.('in', null, null, null);
    } else if (port.type === BoxPortType.cascade) {
      // 在实际应用中，这里应该打开一个盒子选择界面
      // 这里简化为直接调用onChange
      onChange?.('co', null, null, null);
    }
  };
  
  // 根据Flutter代码中的逻辑确定aspectRatio
  const outputBoxTotal = chaoqianBoxPorts.length;
  const isMore = outputBoxTotal < 9;
  const isMobile = window.innerWidth <= 768;
  const aspectRatio = isMore ? '3/1' : '2/1';
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        padding: `${isMobile ? '10px' : '20px'} 5px`,
        background: `url('/assets/images/chaoqian/box.png')`,
        backgroundSize: 'cover',
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      {!isMobile && (
        <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 1 }}>
          <InfoCircleOutlined 
            style={{ color: '#999' }} 
            onClick={showColorInfoModal}
          />
        </div>
      )}
      
      <div style={{ position: 'relative', aspectRatio, padding: '10px 30px' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {chaoqianBoxPorts.map((port) => (
            <div
              key={port.id}
              style={{
                position: 'absolute',
                left: `${port.x * 100}%`,
                top: `${port.y * 100}%`,
                width: `${port.width * 100}%`,
              }}
            >
              {isSelect && (port.type === BoxPortType.input || port.type === BoxPortType.cascade) ? (
                <BoxPortWidget
                  codeChangeFunction={codeChangeFunction}
                  width={port.width * containerSize.width}
                  type={port.type}
                  name={port.name}
                  boxPort={port}
                  onTap={() => handlePortTap(port)}
                />
              ) : (
                <BoxPortWidget
                  codeChangeFunction={codeChangeFunction}
                  width={port.width * containerSize.width}
                  type={port.type}
                  name={port.name}
                  boxPort={port}
                  onCodeChange={(code) => handleCodeChange(code, port.name)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HubBox; 