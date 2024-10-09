import { OpticalCableMonitoringWaringModel } from '@/pages/home/DataModel';
// @ts-ignore
import { BorderBox13, Decoration4 } from '@jiaminghi/data-view-react';
import React, { useEffect, useState } from 'react';
import './home.css';

interface Props {
  data?: OpticalCableMonitoringWaringModel[];
}

enum CableState {
  Normal = 'Normal',
  Warning = 'Warning',
  Critical = 'Critical',
}

interface CableData {
  state: CableState;
  cableName: string;
}

interface CarouselProps {
  data: CableData[];
  interval?: number;
}

const CableCarousel: React.FC<CarouselProps> = ({ data, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (data.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, interval);

    return () => clearInterval(timer);
  }, [data.length, interval]);

  const getDisplayedItems = () => {
    const end = currentIndex + 10;
    if (end <= data.length) {
      return data.slice(currentIndex, end);
    } else {
      return data.slice(currentIndex).concat(data.slice(0, end - data.length));
    }
  };

  const getColorByState = (state: CableState) => {
    switch (state) {
      case CableState.Normal:
        return 'blue';
      case CableState.Warning:
        return 'yellow';
      case CableState.Critical:
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <BorderBox13
      style={{
        padding: '20px 15px 20px 15px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        className="headerContent"
        style={{
          height: '30px',
          paddingInline: '10px',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div className="headerBorder1" style={{ fontSize: '26px', color: 'rgba(255,255,255,0.8)' }}>
          近期告警信息
        </div>
        <div className="headerBorder3" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)' }}>
          更多
        </div>
      </div>
      <Decoration4 reverse={true} style={{ width: '100%', height: '5px' }} />
      <div
        id="123"
        style={{
          textAlign: 'center',
          overflowY: 'auto', // 启用垂直滚动
          transition: 'transform 1s ease-in-out',
          // overflow: 'hidden',
          // backgroundColor: 'crimson',
          flexGrow: 1,
          height: '100%',
          // transform: `translateY(-${currentIndex * 45}px)`,
        }}
      >
        {getDisplayedItems().map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              fontSize: '20px',
              paddingTop: '23px',
              paddingInline: '10px',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: getColorByState(item.state),
                marginRight: '10px',
                borderRadius: '50%', // 圆角
                flexShrink: 0, // 确保图标不会缩小
              }}
            ></div>
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '600px',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              {item.cableName}
            </div>
          </div>
        ))}
      </div>
    </BorderBox13>
  );
};

export default CableCarousel;

// <div
//   className="headerContent"
//   style={{
//     height: '30px',
//     paddingInline: '10px',
//     alignItems: 'center',
//   }}
// >
//   <div className="headerBorder1" style={{fontSize: '26px'}}>
//     近期告警信息
//   </div>
//   <div className="headerBorder3">更多</div>
// </div>
// <Decoration4 reverse={true} style={{width: '100%', height: '5px'}}/>
