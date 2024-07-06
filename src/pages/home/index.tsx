import React from "react";
import ReactEcharts from "echarts-for-react";
import { BorderBox11,FullScreenContainer } from '@jiaminghi/data-view-react'

const MyChart = ({ option }) => (
  <ReactEcharts
    option={option}
  />
);

const PieChart = ({ title }) => {
  const pieChartOptions = {
    title: {
      text: title,
      left: 'center',
      top: 20,
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      right: '20',
      top: 'center',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        center: ['35%', '50%'],
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <BorderBox11 style={{ width: '600px', height: '400px', marginBottom: '20px' }}>
      <ReactEcharts option={pieChartOptions} style={{ height: '100%', width: '100%' }} />
    </BorderBox11>
  );
};

const Home: React.FC = () => {

  const centerPosition = ['30%', '50%']; // 调整图表位置
  // 扇形数据
  const getPieOption = (title: string, data: any[]) => {
    return {
      title: {
        text: title,
        left: 'center',
        top: '4%',
        textStyle: {
          color: '#ffffff',
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'item',
      },
      // 对应文字
      legend: {
        orient: 'vertical',
        right: '20',
        top: 'middle',
        textStyle: {
          color: '#ffffff',
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['30%', '60%'],
          center: centerPosition, // 调整图表位置
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          labelLine: {
            show: false,
          },
          data: data.map((item, index) => ({
            ...item,
            itemStyle: {
              color: [
                'rgba(0, 94, 255, 0.8)',
                'rgba(36, 254, 180, 0.8)',
                'rgba(35, 83, 155, 0.8)',
                'rgba(60, 157, 228, 0.8)',
                'rgba(255, 255, 0, 0.8)',
              ][index],
            },
          })),
        },
      ],
      graphic: [
        {
          type: 'text',
          left: '22%', // 确保文本位置与图表中心对齐
          top: '48%', //   // 确保文本位置与图表中心对齐
          style: {
            text: '5136.05千米',
            textAlign: 'center',
            fill: '#ffffff',
            fontSize: 18,
            fontWeight: 'bold',
          },
        },
      ],
      backgroundColor: 'transparent',
    };
  };

  const data = [
    { value: 23, name: '钟管分公司' },
    { value: 40, name: '武康分公司' },
    { value: 15, name: '乾元分公司' },
    { value: 20, name: '新市分公司' },
    { value: 2, name: '其它' },
  ];

  return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        backgroundImage: "url('/home_bg.png')",
        backgroundSize: '100% 100%',
      }}>
        <div style={{flex: 1, backgroundColor: 'transparent', color: '#ffffff', padding: '10px', width: '50%'}}>
          <BorderBox11 style={{width: '500px', height: '400px', marginBottom: '20px'}}>
            <ReactEcharts option={getPieOption('1', data)} style={{height: '100%', width: '100%'}}/>
          </BorderBox11>
        </div>
        <div style={{flex: 1, backgroundColor: 'transparent', color: '#ffffff', padding: '10px', width: '50%'}}>
          <BorderBox11 style={{width: '500px', height: '400px', marginBottom: '20px'}}>
            <ReactEcharts option={getPieOption('1', data)} style={{height: '100%', width: '100%'}}/>
          </BorderBox11>
        </div>
        <div style={{flex: 1, backgroundColor: 'transparent', color: '#ffffff', padding: '10px', width: '50%'}}>
          <BorderBox11 style={{width: '500px', height: '400px', marginBottom: '20px'}}>
            <ReactEcharts option={getPieOption('1', data)} style={{height: '100%', width: '100%'}}/>
          </BorderBox11>
        </div>
      </div>
  );
};

export default Home;


// const getBarOption = () => ({
//   title: {
//     text: '柱状图示例',
//     left: 'center',
//     top: '10%',
//     textStyle: {
//       color: '#ffffff',
//       fontSize: 16,
//     },
//   },
//   tooltip: {
//     trigger: 'axis',
//     axisPointer: {
//       type: 'none',
//     },
//   },
//   xAxis: {
//     type: 'category',
//     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ],
//     axisLine: {
//       show: false,
//     },
//     axisTick: {
//       show: false,
//     },
//     axisLabel: {
//       color: '#ffffff',
//     },
//   },
//   yAxis: {
//     type: 'value',
//     axisLine: {
//       show: false,
//     },
//     axisTick: {
//       show: false,
//     },
//     axisLabel: {
//       color: '#ffffff',
//     },
//     splitLine: {
//       show: false,
//     },
//   },
//   series: [
//     {
//       data: [120, 200, 150, 80, 70, 110, 130],
//       type: 'bar',
//       labelLine: {
//         show: false,
//       }
//     },
//   ],
//   backgroundColor: 'transparent',
// });
{/*backgroundColor:'#000000',width:'80%'*/
}
{/*<div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>*/}
{/*  <div style={{height: '30%'}}>*/}
{/*    <MyChart option={getBarOption()}/>*/}
{/*  </div>*/}
{/*</div>*/}
{/*<div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>*/}
{/*  <div style={{flex: 1, backgroundColor: 'transparent', color: '#ffffff', padding: '10px'}}>*/}
{/*    <h3>列表 1</h3>*/}
{/*    <ul>*/}
{/*      <li>项 1</li>*/}
{/*      <li>项 2</li>*/}
{/*      <li>项 3</li>*/}
{/*    </ul>*/}
{/*  </div>*/}
{/*  <div style={{flex: 1, backgroundColor: 'transparent', color: '#ffffff', padding: '10px'}}>*/}
{/*    <h3>列表 2</h3>*/}
{/*    <ul>*/}
{/*      <li>项 1</li>*/}
{/*      <li>项 2</li>*/}
{/*      <li>项 3</li>*/}
{/*    </ul>*/}
{/*  </div>*/}
{/*</div>*/}
