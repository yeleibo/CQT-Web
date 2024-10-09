import { ResourceStaticModel } from '@/pages/home/DataModel';
import { BorderBox11 } from '@jiaminghi/data-view-react';
import ReactECharts from 'echarts-for-react';

interface Props {
  data: ResourceStaticModel;
}

// 扇形数据
const PieChart = (props: Props) => {
  const { data } = props;
  const centerPosition = ['0%', '58%']; // 调整图表位置

  const pieChartOptions = {
    //标题文字配置
    // title: {
    //   text: data.name,
    //   left: 'center',
    //   textStyle: {
    //     color: '#ffffff',
    //     fontSize: 16,
    //   },
    // },
    //提示文字
    tooltip: {
      trigger: 'item',
      backgroundColor: '#667c89',
      borderColor: 'transparent',
      textStyle: {
        fontSize: '18',
        color: 'white',
        // fontWeight: 'bold',
      },
      formatter: (params: any) => {
        return `${params.name} : ${params.data.amount}${data.unitName}`;
      },
    },
    //参考选项
    legend: {
      orient: 'vertical',
      right: '5%',
      top: '25%',
      itemGap: 30,
      itemWidth: 20,
      textStyle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
      },
    },
    //数据配置
    series: [
      {
        type: 'pie',
        radius: ['40%', '80%'],
        center: ['35%', '55%'], // 调整图表位置
        avoidLabelOverlap: false,
        label: {
          formatter: '{d}%',
          position: 'inside',
          color: 'rgba(255,255,255,0.8)',
          fontSize: 18,
          fontWeight: 'bold',
        },
        labelLine: {
          show: false,
        },
        data: data.item.map((item, index) => ({
          value: item.percent,
          name: item.name,
          amount: item.amount,
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
    //中心文字
    graphic: [
      {
        type: 'text',
        left: '24%', // 确保文本位置与图表中心对齐
        top: '55%', //   // 确保文本位置与图表中心对齐
        style: {
          text: data.totalAmount + data.unitName,
          textAlign: 'center',
          fill: 'rgba(255,255,255,0.8)',
          color: 'rgba(255,255,255,0.8)',
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
    ],
    // backgroundColor: 'red',
    backgroundColor: 'transparent',
  };

  return (
    <BorderBox11 title={data.name}>
      <div
        style={{
          // backgroundColor: 'crimson',
          height: '100%',
          width: '100%',
          padding: '15px',
        }}
      >
        <ReactECharts style={{ height: '100%', width: '100%' }} option={pieChartOptions} />
      </div>
    </BorderBox11>
  );
};

export default PieChart;
