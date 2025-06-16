import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { groupBoxes } from '@/store/areaDeviceDataSlice';
import { ChaoqianBoxDto } from '@/store/types';

interface XBoxDeviceProps {
  box: ChaoqianBoxDto;
}

const XBoxDevice: React.FC<XBoxDeviceProps> = ({ box }) => {
  const dispatch = useAppDispatch();
  const { boxInfo } = useAppSelector(state => state.areaDeviceData);
  
  // 判断是否是选中的盒子
  const isSelected = boxInfo && boxInfo.id === box.id;
  
  // 处理点击事件
  const handleClick = () => {
    dispatch(groupBoxes({ boxId: box.id }));
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
          onClick={handleClick}
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
            
            <div style={{ margin: '10px 0' }}>
              {box.name}
            </div>
            
            <div>
              {box.code}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XBoxDevice; 