import React, { useState } from 'react';
import { Input, Tooltip } from 'antd';
import { BoxPortType, BoxPortStatus, ChaoqianBoxPortDto } from '@/models/chaoqian';

interface BoxPortWidgetProps {
  width: number;
  type: BoxPortType;
  name: string;
  boxPort: ChaoqianBoxPortDto;
  codeChangeFunction?: () => Promise<string | null>;
  onCodeChange?: (code: string | null) => void;
  onTap?: () => void;
}

const getPortColor = (status: BoxPortStatus) => {
  switch (status) {
    case BoxPortStatus.Linked:
      return '#52c41a'; // 绿色
    case BoxPortStatus.Error:
      return '#ff4d4f'; // 红色
    case BoxPortStatus.Unlinked:
    default:
      return '#d9d9d9'; // 灰色
  }
};

const BoxPortWidget: React.FC<BoxPortWidgetProps> = ({
  width,
  type,
  name,
  boxPort,
  codeChangeFunction,
  onCodeChange,
  onTap,
}) => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState<string>(boxPort.cableCode || '');

  const handlePortClick = async () => {
    if (onTap) {
      onTap();
      return;
    }

    if (codeChangeFunction) {
      const code = await codeChangeFunction();
      onCodeChange?.(code);
      return;
    }

    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setInputVisible(false);
    onCodeChange?.(inputValue || null);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setInputVisible(false);
      onCodeChange?.(inputValue || null);
    }
  };

  const minWidth = 30;
  const calculatedWidth = Math.max(width, minWidth);
  
  const portColor = getPortColor(boxPort.status);
  
  return (
    <Tooltip title={`${name}: ${boxPort.cableCode || 'No code'}`}>
      <div 
        style={{ 
          width: calculatedWidth,
          height: 30,
          backgroundColor: portColor,
          borderRadius: 15,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
        onClick={handlePortClick}
      >
        {inputVisible ? (
          <Input
            autoFocus
            size="small"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyPress={handleInputKeyPress}
            style={{ width: calculatedWidth, height: '100%' }}
          />
        ) : (
          <span style={{ color: '#fff', fontWeight: 'bold' }}>{name}</span>
        )}
      </div>
    </Tooltip>
  );
};

export default BoxPortWidget; 