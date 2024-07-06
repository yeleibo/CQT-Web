import { CurlyBrackets3Painter, LineCanvasWithText } from '@/pages/topology/CurlyBrackets';
import React from 'react';

const TopologyPage: React.FC = () => {
  const dottedStyle: React.CSSProperties = {
    border: '2px dashed black',
    borderRadius: '20px',
    width: '200px',
    height: '375px',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  };

  const outerContainerStyle: React.CSSProperties = {
    width: '225px', // 增加宽度以容纳 LineCanvasWithText 组件
    height: '400px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const topRightCircleStyle: React.CSSProperties = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'green',
    position: 'absolute',
    top: '50px',
    right: '0',
  };

  const listStyle: React.CSSProperties = {
    marginTop: '20px',
    height: '150px',
    width: '160px',
    marginBottom: '-30px',
    overflowY: 'auto',
  };

  const smallCircleStyle: React.CSSProperties = {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: 'blue', // 设置你的颜色
  };

  const boxContainerStyle: React.CSSProperties = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: '#d3d3d3',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const imageStyle: React.CSSProperties = {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: 'red',
  };

  return (
    <div>
      <CurlyBrackets3Painter></CurlyBrackets3Painter>
      <div style={outerContainerStyle}>
        <div style={dottedStyle}>
          <div style={boxContainerStyle}>
            <div style={imageStyle}></div>
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
          <div style={listStyle}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '11px' }}>
              {/* 假数据列表 */}
              {[...Array(8)].map((_, index) => (
                <div key={index} style={smallCircleStyle}></div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '-10px' }}>
            <div style={{ fontWeight: 'bold' }}>Device Name: Example</div>
            <div style={{ fontWeight: 'bold' }}>Code: 12345</div>
          </div>
        </div>
        <div style={topRightCircleStyle}></div>
        <div style={{ position: 'absolute', left: 'calc(100%)', top: '15px' }}>
          <LineCanvasWithText></LineCanvasWithText>
        </div>
      </div>
    </div>
  );
};

export default TopologyPage;
