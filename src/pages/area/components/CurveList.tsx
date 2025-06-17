import React from 'react';
import { ChaoqianBoxPortDto, BoxPortStatus } from '@/models/chaoqian';

interface CurveListProps {
  chaoqianBoxPortDto: ChaoqianBoxPortDto[];
  showONU?: boolean;
}

// 曲线连接组件
export const CurveListMulti: React.FC<CurveListProps> = ({ 
  chaoqianBoxPortDto, 
  showONU = false 
}) => {
  return (
    <div style={{ 
      width: '100%', 
      height: 100, 
      position: 'relative', 
      display: 'flex', 
      justifyContent: 'space-evenly' 
    }}>
      {chaoqianBoxPortDto.map((port) => {
        const isError = port.status === BoxPortStatus.Error;
        const isLinked = port.status === BoxPortStatus.Linked;
        const lineColor = isError ? 'red' : isLinked ? 'green' : '#ccc';
        
        return (
          <div 
            key={port.id}
            style={{
              width: 30,
              height: 100,
              position: 'relative'
            }}
          >
            {/* 曲线连接线 */}
            {isLinked && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 14,
                  width: 2,
                  height: '100%',
                  backgroundColor: lineColor
                }}
              />
            )}
            
            {/* 端口名称标签 */}
            <div style={{
              position: 'absolute',
              top: -25,
              width: '100%',
              textAlign: 'center',
              fontSize: 12
            }}>
              {port.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}; 