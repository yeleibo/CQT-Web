import React, { useState } from 'react';
import { Card, Row, Col, Typography, Image, Button } from 'antd';
import { useModel } from '@umijs/max';
import { ChaoqianBoxDto } from '@/models/chaoqian';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import { getFileUrl } from '@/services/api';


const { Text } = Typography;

interface OnuInfoProps {
  onu: ChaoqianBoxDto;
}

const OnuInfo: React.FC<OnuInfoProps> = ({ onu }) => {
  const { hideCard } = useModel('useAreaDeviceModel');
  const [imageVisible, setImageVisible] = useState(false);
  
  // 处理关闭
  const handleClose = () => {
    hideCard();
  };
  
  return (
    <Card 
      style={{ width: '90%', margin: '0 auto' }}
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={handleClose}
          style={{ border: '1px solid black', borderRadius: '50%' }}
        />
      }
    >
      <Row gutter={16} align="middle">
        <Col span={12}>
          {/* 图片显示 */}
          {onu.files && onu.files.length > 0 ? (
            <div
              style={{ width: 300, height: 100, cursor: 'pointer' }}
              onClick={() => setImageVisible(true)}
            >
              <Image
                width={300}
                height={100}
                src={getFileUrl(onu.initFiles?.[0]?.url || '')}
                preview={false}
              />
            </div>
          ) : (
            <div style={{ width: 300, height: 100 }} />
          )}
        </Col>
        
        <Col span={12}>
          <Row gutter={[0, 8]}>
            <Col span={24}>
              <Text strong>编码：{onu.code}</Text>
            </Col>
            <Col span={24}>
              <Text strong>名称：{onu.name}</Text>
            </Col>
            <Col span={24}>
              <Text strong>线缆编码：{onu.chaoqianBoxPorts[0]?.cableCode || ''}</Text>
            </Col>
            <Col span={24}>
              <Text strong>经度：{onu.longitude}</Text>
            </Col>
            <Col span={24}>
              <Text strong>纬度：{onu.latitude}</Text>
            </Col>
            <Col span={24}>
              <Text strong>地址：{onu.address}</Text>
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
          {onu.initFiles?.map((file, index) => (
            <Image key={index} src={getFileUrl(file.url)} />
          ))}
        </Image.PreviewGroup>
      </div>
    </Card>
  );
};

export default OnuInfo; 