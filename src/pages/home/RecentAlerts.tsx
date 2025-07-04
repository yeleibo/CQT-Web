import { useModel } from '@@/exports';
import React, { useEffect, useState } from 'react';
import './commonStyles.css';
import './home.css';
import './RecentAlerts.css';
import headerIcon from '@/assets/home/header_icon.svg';
import {
  OpticalCableMonitoringWaringState,
  OpticalCableMonitoringWarning,
} from '@/pages/home/OpticalCableMonitoring/typings';
import { DailyInstallation } from '@/pages/project/type';


interface RecentAlertsProps {
  heightRatio?: number; // 控制高度比例，默认为1（100%）
  data?: OpticalCableMonitoringWarning[] | DailyInstallation[]; // 允许传入两种类型的数据
}

const RecentAlerts: React.FC<RecentAlertsProps> = ({ heightRatio = 1, data = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { initialState } = useModel('@@initialState');
  const MAX_DISPLAY_COUNT = 10; // 最大显示条数

  /** 滚动逻辑 - 仅当数据超过最大显示数量时才滚动 */
  useEffect(() => {
    // 如果数据总量不超过最大显示数量，不需要滚动
    if (data.length <= MAX_DISPLAY_COUNT) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [data]);

  const getDisplayedItems = () => {
    // 如果数据总量不超过最大显示数量，全部显示
    if (data.length <= MAX_DISPLAY_COUNT) return data;

    // 数据超过最大显示数量时，显示从当前索引开始的MAX_DISPLAY_COUNT条数据
    const visible = data.slice(currentIndex, currentIndex + MAX_DISPLAY_COUNT);
    if (visible.length < MAX_DISPLAY_COUNT) {
      return visible.concat(data.slice(0, MAX_DISPLAY_COUNT - visible.length));
    }
    return visible;
  };

  // 根据告警状态获取图标颜色
  const getIconColorByState = (item: OpticalCableMonitoringWarning | DailyInstallation) => {
    // 如果是告警对象，使用告警状态
    if ('state' in item && typeof item.state === 'number') {
      switch (item.state) {
        case OpticalCableMonitoringWaringState.Cleared:
          return {
            innerColor: '#0BCD97',
            borderColor: '#0BCD97',
            textColor: '#415B73',
          };
        case OpticalCableMonitoringWaringState.NotCleared:
          return {
            innerColor: '#EA525E',
            borderColor: '#EA525E',
            textColor: '#EA525E',
          };
        default:
          return {
            innerColor: '#FF8F1F',
            borderColor: '#FF8F1F',
            textColor: '#FF8F1F',
          };
      }
    } 
    // 如果是安装记录，使用默认绿色（已完成）
    return {
      innerColor: '#0BCD97',
      borderColor: '#0BCD97',
      textColor: '#415B73',
    };
  };
  
  // 获取显示的名称和类型
  const getDisplayInfo = (item: OpticalCableMonitoringWarning | DailyInstallation) => {
    if ('cableName' in item) {
      return { name: item.cableName, type: item.type || '光缆' };
    } else {
      return { name: item.name, type: item.type };
    }
  };

  return (
    <div
      style={{
        height: `${60 * heightRatio}%`, // 使用百分比高度，占父容器的60%
        maxHeight: 'fit-content',
      }}
    >
      <div className="stats-card" style={{ height: '100%' }}>
        <div className="stats-header ">
          <span className="stats-header-icon">
            <img src={headerIcon} alt="header icon" />
          </span>
          <span className="stats-title ">最新动态</span>
        </div>
        <div
          className="recent-alerts-content stats-scrollable"
          style={{
            height: 'calc(100% - 48px)', // 总高度减去头部高度
            flex: 'none',
          }}
        >
          {data.length === 0 ? (
            <div className="recent-alerts-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>暂无动态信息</div>
          ) : (
            <div
              className={`recent-alerts-list ${data.length > MAX_DISPLAY_COUNT ? 'scrolling' : ''}`}
              style={{ height: '100%' }}
            >
              {getDisplayedItems().map((item, index) => {
                const colors = getIconColorByState(item);
                const displayInfo = getDisplayInfo(item);
                return (
                  <div key={`${item.id}-${index}`} className="recent-alerts-item">
                    <div className="recent-alerts-item-icon-container">
                      <div
                        className="recent-alerts-item-icon-outer"
                        style={{ borderColor: colors.borderColor }}
                      ></div>
                      <div
                        className="recent-alerts-item-icon-inner"
                        style={{ background: colors.innerColor }}
                      ></div>
                    </div>
                    <div className="recent-alerts-item-text" style={{ color: colors.textColor }}>
                      {displayInfo.type} - {displayInfo.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentAlerts;
