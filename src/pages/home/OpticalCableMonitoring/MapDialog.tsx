import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

interface MapDialogProps {
  title: string;
  content: string;
  onClose: () => void;
  isVisible: boolean;
}

const MapDialog: React.FC<MapDialogProps> = ({ title, content, onClose, isVisible }) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '300px',
        height: '200px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        overflowY: 'auto',
        pointerEvents: 'auto',
        display: isVisible ? 'block' : 'none',
      }}
    >
      <div
        style={{
          padding: '10px',
          backgroundColor: '#ffffff',
          fontSize: '18px',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        {title}
      </div>

      <div style={{ padding: '10px' }}>{content}</div>

      <Button
        icon={<CloseOutlined />}
        style={{
          position: 'absolute',
          top: '1px',
          right: '1px',
          cursor: 'pointer',
        }}
        onClick={onClose}
      ></Button>
    </div>
    // <div
    //   style={{
    //     position: 'absolute',
    //     width: '300px',
    //     height: '200px',
    //     backgroundColor: '#000000',
    //     // backgroundColor: '#ffffff',
    //     borderRadius: '10px',
    //     overflowY: 'auto',
    //     pointerEvents: 'auto',
    //     display: this.isVisible ? 'block' : 'none',
    //   }}
    // >
    //   {/* 标题 */}
    //   <div
    //     style={{
    //       padding: '10px',
    //       backgroundColor: '#ffffff',
    //       fontSize: '18px',
    //       fontWeight: 'bold',
    //       textAlign: 'center',
    //     }}
    //   >
    //     {title}
    //   </div>
    //
    //   {/* 内容 */}
    //   <div style={{ padding: '10px' }}>{content}</div>
    //
    //   {/* 关闭按钮 */}
    //   <Button
    //     icon={<CloseOutlined />}
    //     onClick={this.closeDialog.bind(this)}
    //     style={{
    //       position: 'absolute',
    //       top: '10px',
    //       right: '10px',
    //       cursor: 'pointer',
    //     }}
    //   />
    // </div>,
  );
};

export default MapDialog;
