import { EngineeringStaticsByOrganize } from '@/pages/home/DataModel';
// @ts-ignore
import { BorderBox10 } from '@jiaminghi/data-view-react';
import ReactECharts from 'echarts-for-react';
import React from 'react';
interface Props {
  data: EngineeringStaticsByOrganize[];
}

// 柱状图
const BarChart = (props: Props) => {
  const { data } = props;
  const barChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none', // 取消辅助线显示
      },
      formatter: function (params: any[]) {
        const param = params[0];
        const total = param.value;
        const completed = param.data.finishedAmount;
        const notCompleted = total - completed;
        return `
          <div>共计: ${total}</div>
          <div>已完成: ${completed}</div>
          <div>未完成: ${notCompleted}</div>
        `;
      },
    },
    legend: {},
    xAxis: {
      data: data.map((e) => e.organizeName),
      axisLabel: {
        color: '#ffffff', // 设置坐标轴文字颜色为白色
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: '#ffffff', // 设置坐标轴文字颜色为白色
      },
    },

    series: [
      {
        type: 'bar',
        // data: data.map((e) => e.totalAmount),
        data: data.map((e) => ({
          value: e.totalAmount,
          finishedAmount: e.finishedAmount,
        })),
        barWidth: '30%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, //右
            y: 0, //下
            x2: 0, //左
            y2: 1, //上
            colorStops: [
              {
                offset: 0,
                color: '#00ffcc', // 70% 处的颜色
              },
              {
                offset: 1,
                color: '#2b80cf', // 100% 处的颜色
              },
            ],
          },
        },
        barCategoryGap: '100%', // 类目间柱形的间隔
        barGap: '100%', // 同一类目内柱形的间隔
      },
    ],
  };

  return (
    <BorderBox10 style={{ height: '100%', width: '100%' }}>
      <div
        className="headerContent"
        style={{
          height: '30px',
          paddingTop: '20px',
          paddingInline: '20px',
          alignItems: 'center',
        }}
      >
        <div
          className="headerBorder1"
          style={{
            fontSize: '26px',
            color: 'white',
          }}
        >
          工程统计
        </div>
      </div>
      <ReactECharts option={barChartOption} style={{ height: '100%', width: '100%' }} />
    </BorderBox10>
  );
};

export default BarChart;
