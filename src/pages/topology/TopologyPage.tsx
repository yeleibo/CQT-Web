import BoxCard from '@/pages/topology/BoxCard';
import { CurlyBrackets3Painter, LineCanvasWithText } from '@/pages/topology/CurlyBrackets';
import BoxStore from '@/pages/topology/boxStore';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import './topology.scss';

interface TopologyProp {
  boxId: number;
  areaId: number;
  isOnu: boolean;
}

const TopologyPage: React.FC<TopologyProp> = observer((props) => {
  const [isPoint, setPoint] = useState<boolean>(false);

  useEffect(() => {
    BoxStore.fetchChaoqianTopology(props.areaId, props.boxId, props.isOnu);
  }, [props.areaId, props.boxId, props.isOnu]);

  return (
    <div className="topologyStyle">
      <div className="fatBoxContainer">
        <div className="fatBox"></div>
        <div className="onu">
          <CurlyBrackets3Painter chaoqianBoxPortDto={[]}></CurlyBrackets3Painter>
        </div>
      </div>
      <div className={`outer-container show-line`}>
        <div className="dotted-style">
          <div className="box-container-style">
            <div className="image-style"></div>
          </div>
          z<div style={{ height: '10px' }}></div>
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
            <div className="port-array">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className={`port-outer-container ${isPoint ? 'point' : 'unPoint'}`}
                >
                  <div
                    key={index}
                    className="port-circle-style"
                    onClick={() => {
                      setPoint(!isPoint);
                    }}
                  ></div>
                </div>
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

      <svg width="400" height="100" viewBox="-400 -20 400 120">
        <path
          d="M0,-10 C0,110 -375,4 -375,90"
          stroke="black"
          fill="transparent"
          strokeWidth="1.5"
        />
        <text x="-187.5" y="40" fontFamily="Arial" fontSize="16" textAnchor="middle">
          Above
        </text>
        <text x="-187.5" y="80" fontFamily="Arial" fontSize="16" textAnchor="middle">
          Below
        </text>
      </svg>

      {BoxStore.showCard && <BoxCard />}
    </div>
  );
});
export default TopologyPage;
