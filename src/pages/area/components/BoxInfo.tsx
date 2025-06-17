import React, { useState } from 'react';
import { Card, Row, Col, Table, Image, Typography, Button } from 'antd';
import { BoxPortType, ChaoqianBoxDto, ChaoqianBoxPortDto, BoxPortStatus } from '@/models/chaoqian';
import { useModel } from '@umijs/max';

import XBox from './boxes/XBox';
import HubBox from './boxes/HubBox';
import FatBox from './boxes/FatBox';
import FatEndBox from './boxes/FatEndBox';
import { getFileUrl } from '@/services/api';


const { Title, Text } = Typography;

interface BoxInfoProps {
  box: ChaoqianBoxDto;
}

const BoxInfo: React.FC<BoxInfoProps> = ({ box }) => {
  const { hideCard } = useModel('useAreaDeviceModel');
  const [imageVisible, setImageVisible] = useState(false);
  
  // 根据盒子类型返回对应的盒子组件
  const getBoxComponent = () => {
    switch (box.type) {
      case 'XBox':
        return <XBox chaoqianBoxPorts={box.chaoqianBoxPorts} />;
      case 'HubBox':
        return <HubBox chaoqianBoxPorts={box.chaoqianBoxPorts} />;
      case 'FatBox':
        return <FatBox chaoqianBoxPorts={box.chaoqianBoxPorts} />;
      case 'FatEndBox':
        return <FatEndBox chaoqianBoxPorts={box.chaoqianBoxPorts} />;
      default:
        return <div />;
    }
  };
  
  // 获取输出端口
  const getOutputPorts = (box: ChaoqianBoxDto): ChaoqianBoxPortDto[] => {
    // 先过滤符合条件的元素
    const filteredList = box.chaoqianBoxPorts.filter(
      (e) => e.type === BoxPortType.output
    );
    
    // 再进行排序
    return [...filteredList].sort(
      (x, y) => parseInt(x.name) - parseInt(y.name)
    );
  };
  
  // 定义表格列
  const columns = [
    {
      title: 'Port No.',
      dataIndex: 'index',
      key: 'index',
      width: 100,
      render: (_: any, _record: any, index: number) => index + 1,
    },
    {
      title: 'Out Cable(SN)',
      dataIndex: 'cableCode',
      key: 'cableCode',
      width: 200,
    },
    {
      title: 'Cable Length(m)',
      dataIndex: 'cableLength',
      key: 'cableLength',
      width: 200,
    },
  ];
  
  const outputPorts = getOutputPorts(box);
  
  return (
    <Card 
      style={{ 
        width: '90%',  
        margin: '0 auto',
      }}
    >
      <Row gutter={[32, 16]} align="top">
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            {/* 图片展示 */}
            {box.files && box.files.length > 0 ? (
              <div 
                style={{ width: 300, height: 100, cursor: 'pointer' }}
                onClick={() => setImageVisible(true)}
              >
                <Image
                  width={300}
                  height={100}
                  src={getFileUrl(box.initFiles?.[0]?.url || '')}
                  preview={false}
                />
              </div>
            ) : (
              <div style={{ width: 300, height: 100 }} />
            )}
            
            {/* 盒子展示 */}
            <div style={{ width: 350, height: 190, margin: '20px 0' }}>
              {getBoxComponent()}
            </div>
            
            {/* 状态说明 */}
            <div style={{ width: 300, height: 50 }}>
              <img 
                src="/assets/images/status_explanation.jpg" 
                alt="Status Explanation"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </Col>
        
        <Col span={8}>
          <Table
            columns={columns}
            dataSource={outputPorts}
            pagination={false}
            size="small"
            rowKey={(record) => record.id.toString()}
            scroll={{ y: 450 }}
          />
        </Col>
        
        <Col span={8}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Row>
                <Col span={8}>
                  <div style={styles.infoHeader}>设备名称</div>
                  <div style={styles.infoContent}>{box.name}</div>
                </Col>
                <Col span={8}>
                  <div style={styles.infoHeader}>设备型号</div>
                  <div style={styles.infoContent}>{box.type}</div>
                </Col>
                <Col span={8}>
                  <div style={styles.infoHeader}>设备编码</div>
                  <div style={styles.infoContent}>{box.code}</div>
                </Col>
              </Row>
            </Col>
            
            <Col span={24} style={{ marginTop: 20 }}>
              <Row>
                <Col span={12}>
                  <div style={styles.infoHeader}>入口线缆(SN)</div>
                  <div style={styles.infoContent}>
                    {box.chaoqianBoxPorts.find(p => p.type === BoxPortType.input)?.cableCode || ''}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={styles.infoContent}>
                    {box.chaoqianBoxPorts.find(p => p.type === BoxPortType.input)?.cableLength?.toString() || ''}(m)
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      
      {/* 图片预览弹窗 */}
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible: imageVisible,
            onVisibleChange: (vis) => setImageVisible(vis),
          }}
        >
          {box.initFiles?.map((file, index) => (
            <Image key={index} src={getFileUrl(file.url)} />
          ))}
        </Image.PreviewGroup>
      </div>
    </Card>
  );
};

// 组件样式
const styles = {
  infoHeader: {
    backgroundColor: '#3611ae',
    color: 'white',
    textAlign: 'center' as const,
    padding: '8px',
    border: '1px solid black',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    height: '40px',
    border: '1px solid black',
    borderTop: 'none',
    textAlign: 'center' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default BoxInfo; 