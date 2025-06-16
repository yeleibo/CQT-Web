import React, { useEffect, useState, useRef } from 'react';
import { Card, Spin, message } from 'antd';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { groupBoxes } from '@/store/areaDeviceDataSlice';
import { ChaoqianTopologyDto } from '@/store/types';

import XBoxDevice from './components/XBoxDevice';
import HubBoxDevice from './components/HubBoxDevice';
import FatBoxDevice from './components/FatBoxDevice';
import BoxInfo from './components/BoxInfo';
import OnuInfo from './components/OnuInfo';
import { fetchChaoqianTopology } from '@/services/api';
import { createMockTopologyData } from '@/mock/topologyMockData';

interface DeviceDetailProps {
  areaId: number;
  boxId: number;
  isOnu?: boolean;
}

const DeviceDetail: React.FC<DeviceDetailProps> = ({ 
  areaId, 
  boxId, 
  isOnu = false 
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [topology, setTopology] = useState<ChaoqianTopologyDto | null>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);
  
  const { 
    xBoxes, 
    hubBoxCable, 
    fatBoxCable,
    showCard,
    showOnu,
    boxInfo, 
    onu
  } = useAppSelector(state => state.areaDeviceData);

  // 获取拓扑数据
  useEffect(() => {
    const loadTopology = async () => {
      try {
        setLoading(true);
        // 使用模拟API调用，该API内部使用模拟数据
        // const result = await fetchChaoqianTopology(isOnu ? { customerId: boxId } : { boxId });
        const result = createMockTopologyData();
        setTopology(result);
        // 加载数据后触发分组操作
        dispatch(groupBoxes({ 
          boxId, // 恢复使用传入的boxId
          isOnu, 
          chaoqianTopologyDto: result 
        }));
      } catch (error) {
        message.error('加载拓扑数据失败');
        console.error('Failed to load topology:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTopology();
  }, [boxId, isOnu, dispatch]);

  if (loading || !topology) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" tip="加载拓扑数据中..." />
      </div>
    );
  }

  return (
    <div style={styles.deviceDetail}>
      <div style={styles.deviceDetailContainer}>
        <div 
          className="scroll-container"
          ref={horizontalRef}
          style={{ 
            overflowX: 'auto',
            overflowY: 'auto',
            height: 'calc(100vh - 150px)',
            position: 'relative'
          }}
        >
          <div
            ref={verticalRef}
            style={{ 
              width: 2500,
              height: '100%',
              position: 'relative'
            }}
          >
            <div style={{ padding: '8px 70px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                {/* 显示150宽度的空间 */}
                <div style={{ width: 150 }}></div>
                
                {/* XBox设备 */}
                {xBoxes.length > 0 && (
                  <XBoxDevice box={xBoxes[0]} />
                )}
                
                {/* HubBox设备 */}
                {hubBoxCable.map((hubBox, index) => (
                  <HubBoxDevice 
                    key={hubBox.id} 
                    hubBox={hubBox} 
                    acWith={225}
                  />
                ))}
              </div>
              
              {/* FatBox设备 */}
              <div style={{ paddingLeft: 80, display: 'flex', justifyContent: 'flex-start' }}>
                {fatBoxCable.map((fatBox, index) => (
                  <FatBoxDevice 
                    key={fatBox.id} 
                    fatBox={fatBox}
                    fatBoxCable={fatBoxCable}
                    onus={topology.boxes.filter(box => box.type === 'ONU')}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部信息卡片 */}
        {showCard && boxInfo && (
          <div style={styles.bottomCard}>
            <BoxInfo box={boxInfo} />
          </div>
        )}
        
        {/* ONU信息 */}
        {showOnu && onu && (
          <div style={styles.bottomCard}>
            <OnuInfo onu={onu} />
          </div>
        )}
      </div>
    </div>
  );
};

// 添加组件内样式
const styles = {
  deviceDetail: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%'
  },
  deviceDetailContainer: {
    flex: 1,
    position: 'relative' as const
  },
  bottomCard: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    zIndex: 100
  }
};

export default DeviceDetail; 