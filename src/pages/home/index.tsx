import { EngineeringStaticsByOrganize, ResourceStaticModel } from '@/pages/home/DataModel';
// @ts-ignore
import CableCarousel from '@/pages/home/HomeRight';
// @ts-ignore
import { Decoration5, Decoration8 } from '@jiaminghi/data-view-react';
import React, { useEffect, useState } from 'react';
import PieChart from './HomeLeft';
import './home.css';
const Home: React.FC = () => {
  enum CableState {
    Normal = 'Normal',
    Warning = 'Warning',
    Critical = 'Critical',
  }

  interface CableData {
    state: CableState;
    cableName: string;
  }
  const resourceData: ResourceStaticModel = {
    name: '光纤资源管理 ',
    totalAmount: 5148.06,
    unitName: '千米 ',
    item: [
      {
        name: '钟管分公司',
        amount: 820.36,
        percent: 15,
      },
      {
        name: '武康分公司',
        amount: 2081.15,
        percent: 40,
      },
      {
        name: '乾元分公司',
        amount: 1044.74,
        percent: 20,
      },
      {
        name: '新市分公司',
        amount: 1198.41,
        percent: 23,
      },
      {
        name: '其他',
        amount: 3,
        percent: 2,
      },
    ],
  };
  const data: CableData[] = [
    { state: CableState.Normal, cableName: 'YBGC-莫干山镇燎原村安置二期管道地...' },
    { state: CableState.Warning, cableName: 'YBGC-新市镇新联路建设涉及广电线路...' },
    { state: CableState.Critical, cableName: 'YBGC-新市镇河东路明德机械制造南门...' },
    { state: CableState.Normal, cableName: 'FCGC-莫干山镇安置房项目广电接入工程' },
    { state: CableState.Warning, cableName: 'YBGC-阜溪街道英溪北路（环城北路至...' },
    { state: CableState.Critical, cableName: 'YBGC-新市镇谢家园路建设涉及广电线...' },
    { state: CableState.Normal, cableName: 'JKGC-康乾街道新琪村监控工程' },
    { state: CableState.Warning, cableName: 'YBGC-阜溪街道纬六路广电地埋管道工程' },
    {
      state: CableState.Critical,
      cableName: 'YBGC-武康街道灵山街（岭头路-莫干山镇安置房项目广电接入工程',
    },
    { state: CableState.Critical, cableName: 'YBGC-武康街道灵山街（岭头路-联合123141ddddd241' },
    {
      state: CableState.Critical,
      cableName: 'YBGC-武康街道灵山街（岭头路-莫干山镇安置房项目广电接入工程',
    },
    { state: CableState.Critical, cableName: 'YBGC-武康街道灵山街（岭头路-联合12314dddd1241' },
    { state: CableState.Critical, cableName: 'YBGC-武康街道灵山街（岭头路-联合12314dddd1241' },
    {
      state: CableState.Critical,
      cableName: 'YBGC-武康街道灵山街（岭头路-莫干山镇安置房项目广电接入工程',
    },
    { state: CableState.Critical, cableName: 'YBGC-武康街道灵山街（岭头路-联合12314asdasdasd241' },
  ];
  const barChartData: EngineeringStaticsByOrganize[] = [
    { organizeName: '武康分公司', totalAmount: 209, finishedAmount: 199 },
    { organizeName: '千元分公司', totalAmount: 44, finishedAmount: 43 },
    { organizeName: '新市分公司', totalAmount: 137, finishedAmount: 133 },
    { organizeName: '中观分公司', totalAmount: 85, finishedAmount: 83 },
    { organizeName: '工程规划部', totalAmount: 13, finishedAmount: 12 },
    { organizeName: '项目运维部', totalAmount: 13, finishedAmount: 12 },
  ];

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  //
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/*<FullScreenContainer>*/}
      <div className="main-body">
        <div className="main-header">
          <div className="title">
            <div style={{ fontSize: '48px', color: 'rgba(255,255,255,0.8)' }}>TranMile</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-start' }}>
              <Decoration8 style={{ height: '30px', width: '300px' }} />
            </div>
            <div style={{ flex: '1', display: 'flex', justifyContent: 'center' }}>
              <Decoration5 dur={3} style={{ height: '40px' }} />
            </div>
            <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
              <Decoration8 reverse={true} style={{ height: '30px', width: '300px' }} />
            </div>
          </div>
          <div className="title"> {currentTime}</div>
        </div>
        <div className="main-container">
          <div className="dataLeft">
            <PieChart data={resourceData}></PieChart>
            <PieChart data={resourceData}></PieChart>
            <PieChart data={resourceData}></PieChart>
          </div>

          <div className="dataCenter">
            {/*<div className="map-show">*/}
            {/*  <HomeCenter></HomeCenter>*/}
            {/*</div>*/}
            {/*<div className="gc-show">*/}
            {/*  <BarChart data={barChartData}></BarChart>*/}
            {/*</div>*/}
          </div>
          <div className="dataRight">
            <CableCarousel data={data} />
          </div>
        </div>
      </div>
      {/*</FullScreenContainer>*/}
    </>
  );
};

export default Home;
