import { Card } from 'antd';
import React from 'react';
import './topology.scss';

const BoxCard: React.FC = () => {
  return (
    <div className="cardStyle">
      <Card size={'default'} bordered={false} />
    </div>
  );
};

export default BoxCard;
