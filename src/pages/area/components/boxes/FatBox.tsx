import React, { useRef, useEffect, useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import { ChaoqianBoxPortDto } from '@/models/chaoqian';
import BoxPortWidget from './BoxPortWidget';
import { checkBoxPortCableCode, PortColor, getPortColor } from './chaoqianStringExtension';

// 扩展ChaoqianBoxPortDto接口，添加Flutter版本中使用的属性
interface ExtendedBoxPortDto extends ChaoqianBoxPortDto {
  x: number;
  y: number;
  width: number;
  boxName?: string;
}

interface FatBoxProps {
  chaoqianBoxPorts: ExtendedBoxPortDto[];
  onChange?: (name: string, code: string | null) => void;
  codeChangeFunction?: () => Promise<string | null>;
}

const FatBox: React.FC<FatBoxProps> = ({ chaoqianBoxPorts, onChange, codeChangeFunction }) => {
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
    if (code === null || checkBoxPortCableCode(code, "FatBox", name)) {
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
  
  // 根据Flutter代码中的逻辑确定aspectRatio
  const outputBoxTotal = chaoqianBoxPorts.length > 0 && chaoqianBoxPorts[0].name === '1';
  const isDesktop = window.innerWidth > 768; // 简单的桌面判断逻辑
  const aspectRatio = isDesktop ? '1.6/1' : (outputBoxTotal ? '1.5/1' : '2/1');
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        padding: `10px ${isDesktop ? '40px' : '5px'}`,
        background: `url('/assets/images/chaoqian/box.png')`,
        backgroundSize: 'cover',
        position: 'relative',
        width: '100%',
        height: '100%'
      }}
    >
      <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 1 }}>
        <InfoCircleOutlined 
          style={{ color: '#999' }} 
          onClick={showColorInfoModal}
        />
      </div>
      
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
              <BoxPortWidget
                codeChangeFunction={codeChangeFunction}
                width={port.width * containerSize.width}
                type={port.type}
                name={port.name}
                boxPort={port}
                onCodeChange={(code) => handleCodeChange(code, port.name)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FatBox; 