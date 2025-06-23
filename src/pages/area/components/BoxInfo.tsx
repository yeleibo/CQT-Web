import React, { useState } from 'react';
import { Card, Row, Col, Table, Image, Typography, Button } from 'antd';
import { BoxPortType, ChaoqianBoxDto, ChaoqianBoxPortDto, BoxPortStatus } from '@/models/chaoqian';
import { useModel } from '@umijs/max';
import { CloseOutlined } from '@ant-design/icons';
import { getFileUrl } from '@/services/api';

import XBox from './boxes/XBox';
import HubBox from './boxes/HubBox';
import FatBox from './boxes/FatBox';
import FatEndBox from './boxes/FatEndBox';

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
    const filteredList = box.chaoqianBoxPorts.filter(
      (e) => e.type === BoxPortType.output
    );
    
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
    <div style={{position: 'relative', display: 'flex', justifyContent: 'center'}}>
      <Card 
        style={{ 
          width: '90%',  
          position: 'relative',
          border: '1px solid #e8e8e8',
          borderRadius: '2px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}
        bodyStyle={{ padding: '16px 32px' }}
      >
        <Button 
          type="text" 
          icon={<CloseOutlined />} 
          onClick={() => hideCard()} 
          style={{ 
            position: 'absolute',
            top: 10,
            right: 10,
            color: '#000',
            fontSize: '15px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            border: '1px solid black',
            padding: 0,
            zIndex: 10
          }} 
        />

        <Row gutter={[32, 16]} align="top">
          {/* 左侧部分 */}
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
          
          {/* 中间表格部分 */}
          <Col span={8}>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex' }}>
                <div style={{...styles.tableHeader, width: 100}}>Port No.</div>
                <div style={{...styles.tableHeader, width: 200}}>Out Cable(SN)</div>
                <div style={{...styles.tableHeader, width: 200}}>Cable Length(m)</div>
              </div>
              <div style={{ height: 450, overflowY: 'auto' }}>
                {outputPorts.map((port, index) => (
                  <div style={{ display: 'flex' }} key={port.id.toString()}>
                    <div style={{...styles.tableCell, width: 100}}>{index + 1}</div>
                    <div style={{...styles.tableCell, width: 200}}>{port.cableCode || ''}</div>
                    <div style={{...styles.tableCell, width: 200}}>{port.cableLength?.toString() || ''}</div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
          
          {/* 右侧信息部分 */}
          <Col span={8}>
            <div style={{ height: 300, width: 360 }}>
              <div style={{ width: 360, height: 80, marginBottom: 20 }}>
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
              </div>
              
              <div style={{ width: 360, height: 80 }}>
                <Row>
                  <Col span={12}>
                    <div style={styles.infoHeader}>入口线缆(SN)</div>
                    <div style={styles.infoContent}>
                      {box.chaoqianBoxPorts.find(p => p.type === BoxPortType.input)?.cableCode || ''}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={styles.infoHeader}>级联线缆(SN)</div>
                    <div style={styles.infoContent}>
                      {box.chaoqianBoxPorts.find(p => p.type === BoxPortType.cascade)?.cableCode || ''}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
      
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
    </div>
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
  },
  tableHeader: {
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
  tableCell: {
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