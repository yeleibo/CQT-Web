import { OpticalCableMonitoringWaringModel } from '@/pages/home/DataModel';
// @ts-ignore
import { BorderBox13 } from '@jiaminghi/data-view-react';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { history } from 'umi'; // Umi 提供的 history 对象
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
  const [isMorePaga, setIsMorePage] = useState<boolean>(false);

  const openAddPage = () => {
    setIsMorePage(true);
  };

  useEffect(() => {
    if (data.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, interval);

    return () => clearInterval(timer);
  }, [data.length, interval]);

  const getDisplayedItems = () => {
    const end = currentIndex + 1;
    if (end <= data.length) {
      return data.slice(currentIndex, end);
    } else {
      return data.slice(currentIndex).concat(data.slice(0, end - data.length));
    }
  };

  const getColorByState = (state: CableState) => {
    switch (state) {
      case CableState.Normal:
        return '#00FF7F';
      case CableState.Warning:
        return '#FFD700';
      case CableState.Critical:
        return '#FF4500';
      default:
        return 'gray';
    }
  };

  return (
    <BorderBox13>
      <div
        style={{
          width: '100%',
        }}
      >
        <div className="headerContent">
          <div style={{ fontSize: '24px', color: 'rgba(255,255,255,0.8)' }}>近期告警信息</div>
          <Button
            color="default"
            type="text"
            style={{ fontSize: '24px', color: 'rgba(255,255,255,0.8)' }}
            onClick={() => {
              history.push('/home/OpticalCableMonitoringWaringPage');
            }}
          >
            更多
          </Button>
          {/*<div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)' }}>更多</div>*/}
        </div>
        <div
          style={{
            textAlign: 'center',
            overflowY: 'auto', // 启用垂直滚动
            transition: 'transform 1s ease-in-out',
            // height: '100%',
          }}
        >
          {getDisplayedItems().map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                fontSize: '20px',
                paddingTop: '30px',
                paddingInline: '25px',
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
              />
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
      </div>
    </BorderBox13>
  );
};

export default CableCarousel;
