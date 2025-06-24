import React, { useEffect, useState, useRef } from 'react';
import { Card, Spin, message } from 'antd';
import { useModel } from '@umijs/max';
import { ChaoqianTopologyDto } from '@/models/chaoqian';

import XBoxDevice from './components/XBoxDevice';
import HubBoxDevice from './components/HubBoxDevice';
import FatBoxDevice from './components/FatBoxDevice';
import BoxInfo from './components/BoxInfo';
import OnuInfo from './components/OnuInfo';
import { fetchChaoqianTopology } from '@/services/api';
import TopologyService from '@/services/topology/service';

interface DeviceDetailProps {
  areaId: number;
  boxId: number;
  isOnu?: boolean;
}

const DeviceDetail: React.FC<DeviceDetailProps> = ({ 
  areaId, 
  boxId=614420845408329, 
  isOnu = false 
}) => {
  const { 
    xBoxes, 
    hubBoxCable, 
    fatBoxCable,
    showCard,
    showOnu,
    boxInfo, 
    onu,
    groupBoxes
  } = useModel('useAreaDeviceModel');
  
  const [loading, setLoading] = useState(true);
  const [topology, setTopology] = useState<ChaoqianTopologyDto | null>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);

  // 获取拓扑数据
  useEffect(() => {
    const loadTopology = async () => {
      try {
        setLoading(true);
        const result = await TopologyService.getTopology(boxId);
        setTopology(result);
    
      } catch (error) {
        message.error('加载拓扑数据失败');
        console.error('Failed to load topology:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTopology();
  }, [boxId, isOnu]);  // 添加 showCard 作为依赖项

  useEffect(() => {
    if (topology) {
      // 首次设置topology数据到model中
      groupBoxes({ boxId, isOnu, chaoqianTopologyDto: topology });
    }
  }, [topology]);

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
              width: '100%',
              minWidth: 1200,
              maxWidth: 2500,
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
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  },
  deviceDetailContainer: {
    flex: 1,
    position: 'relative' as const,
    width: '100%',
    height: '100%'
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