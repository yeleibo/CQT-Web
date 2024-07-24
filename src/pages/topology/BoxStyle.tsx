import { LineCanvasWithText } from '@/pages/topology/CurlyBrackets';
import { ChaoqianBoxDto } from '@/pages/topology/type';
import { lightGreen } from 'kolorist';
import React from 'react';
import './topology.scss';

interface BoxProp {
  boxClick: () => void;
  portClick: () => void;
  boxType: string;
  box: ChaoqianBoxDto;
}

const BoxStyle: React.FC<BoxProp> = (props) => {
  // @ts-ignore
  const PortOuterContainer = ({ borderColor, children }) => {
    // 使用传入的变量来设置样式
    const portOuterContainerStyle = {
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      border: `1px solid ${borderColor}`, // 使用变量来设置边框颜色
      backgroundColor: 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };

    return <div style={portOuterContainerStyle}>{children}</div>;
  };
  return (
    <div className={`outer-container ${props.box.isShowFatBox ? 'show-line' : ''}`}>
      <div className="dotted-style" onClick={props.boxClick}>
        <div className="box-container-style">
          <div className="image-style"></div>
        </div>
        <div style={{ height: '10px' }}></div>
        <div
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            alignItems: 'center',
            marginBottom: '10px',
            justifyContent: 'center',
          }}
        >
          OLT
        </div>
        <div className="list-style">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '11px' }}>
            {[...Array(8)].map((_, index) => (
              <PortOuterContainer key={index} borderColor={lightGreen}>
                <div
                  key={index}
                  className="port-circle-style"
                  onClick={() => {
                    props.portClick();
                  }}
                ></div>
              </PortOuterContainer>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '-10px' }}>
          <div style={{ fontWeight: 'bold' }}>Device Name: Example</div>
          <div style={{ fontWeight: 'bold' }}>Code: 12345</div>
        </div>
      </div>
      <div className="top-right-circle-style"></div>
      <div style={{ position: 'absolute', left: 'calc(100%)', top: '15px' }}>
        <LineCanvasWithText></LineCanvasWithText>
      </div>
    </div>
  );
};

export default BoxStyle;
