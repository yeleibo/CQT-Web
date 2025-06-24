import React, { useRef, useEffect, useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Modal, message } from 'antd';
import { ChaoqianBoxPortDto } from '@/models/chaoqian';
import { checkBoxPortCableCode, getPortColor, PortColor } from './chaoqianStringExtension';
import BoxPortWidget from './BoxPortWidget';
import boxImage from '@/assets/images/box.png';

interface XBoxProps {
  chaoqianBoxPorts: ChaoqianBoxPortDto[];
  onChange?: (name: string, code: string | null) => void;
  codeChangeFunction?: () => Promise<string | null>;
}

const XBox: React.FC<XBoxProps> = ({ chaoqianBoxPorts, onChange, codeChangeFunction }) => {
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
    if (code === null || checkBoxPortCableCode(code, "XBox", name)) {
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
            <div key={color} style={{ width: 80, padding: '15px 0', textAlign: 'center' }}>
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
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        padding: '5px',
        background: `url(${boxImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
        height: '180px'
      }}
    >
      <div style={{ position: 'relative', height: '90%', padding: '15px 25px' }}>
        <div style={{ position: 'absolute', right: 1, top: 0, zIndex: 1 }}>
          <InfoCircleOutlined 
            style={{ color: '#999' }} 
            onClick={showColorInfoModal}
          />
        </div>
        
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
      
      {/* 添加端口类型图例 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginTop: '10px',
        fontSize: '11px',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#FF7F50', borderRadius: '50%', marginRight: 3 }}></div>
          <span>Input</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#4B0082', borderRadius: '50%', marginRight: 3 }}></div>
          <span>Output</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#C0C0C0', borderRadius: '50%', marginRight: 3 }}></div>
          <span>UnOccupy</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#3CB371', borderRadius: '50%', marginRight: 3 }}></div>
          <span>Occupied</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#FFD700', borderRadius: '50%', marginRight: 3 }}></div>
          <span>Fault</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#9370DB', borderRadius: '50%', marginRight: 3 }}></div>
          <span>Cascade</span>
        </div>
      </div>
    </div>
  );
};

export default XBox; 