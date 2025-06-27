import { EngineeringStaticsByOrganize } from '@/pages/home/DataModel';
// @ts-ignore
import { Column } from '@ant-design/charts';
import './commonStyles.css';

interface Props {
  data: EngineeringStaticsByOrganize[];
}

// 工程统计
const EngineeringBarChart = (props: Props) => {
  const { data } = props;
  const config = {
    data,
    xField: 'organizeName',
    yField: 'totalAmount',
    inset: 10,
    style: {
      fill: 'l(90) 0:#18CFF8 1:#0085FF',
      maxWidth: 40,
    },
    axis: {
      x: {
        line: false, // 是否显示轴线
        tick: true, // 轴线宽度
        tickStrokeOpacity: 0, // 轴线颜色透明度
        tickLength: 10, // 轴线长度,
        grid: false,
        labelFill: '#7395B3',
        labelFontFamily: 'PingFang SC', // 刻度值字体
        labelFontSize: 16,
        labelFontWeight: 400, // 刻度值字体粗细
      },
      y: {
        tick: true, // 轴线宽度
        tickStrokeOpacity: 0, // 轴线颜色透明度
        tickLength: 10, // 轴线长度,
        grid: true, // 是否显示网格线
        gridLineWidth: 2, // 网格线宽度
        labelFill: '#7395B3',
        labelFontFamily: 'PingFang SC', // 刻度值字体
        labelFontSize: 16,
        labelFontWeight: 400, // 刻度值字体粗细
      },
    },
    legend: false,
  };

  return (
    <div className="stats-card">
      <div className="stats-header">
        <span className="stats-header-icon">
          <img src="/web/home/header_icon.svg" alt="header icon" />
        </span>
        <span className="stats-title">工程统计</span>
      </div>
      <div className="stats-content">
        <div style={{ height: '100%', width: '100%' }}>
          <Column {...config} />
        </div>
      </div>
    </div>
  );
};

export default EngineeringBarChart;
