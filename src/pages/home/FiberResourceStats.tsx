import { Pie } from '@ant-design/charts';
import './FiberResourceStats.css';
import './commonStyles.css';
import headerIcon from '@/assets/home/header_icon.svg';
import { ResourceGroup } from '@/pages/project/type';

interface Props {
  data: ResourceGroup;
}

const colorList = ['#2B8EF3', '#3CD495', '#BEE5FB', '#48E5E5', '#2B8EF3'];

// 统计
const FiberResourceStats = (props: Props) => {
  const { data } = props;

  // 准备Ant Design Charts的数据
  const pieData = data.items.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: colorList[index % colorList.length],
  }));

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'name',
    radius: 0.5,
    innerRadius: 0.7,
    style: {
      stroke: '#fff',
      inset: 1,
    },
    scale: {
      color: { range: colorList },
    },
    annotations: [
      {
        type: 'text',
        style: {
          text: `${data.value}\n${data.unit || ''}`,
          x: '50%',
          y: '50%',
          textAlign: 'center',
          fontSize: 24,
          // fontStyle: 'bold',
        },
      },
    ],
    // 鼠标悬停时的提示信息
    tooltip: {
      items: [
        (datum: any) => ({
          name: datum.name,
          value: `${datum.value} ${data.unit || ''}`,
        }),
      ],
    },
    // 说明
    legend: false,
  };
  return (
    <div className="stats-card">
      <div className="stats-header">
        <span className="stats-header-icon">
          <img src={headerIcon} alt="header icon" />
        </span>
        <span className="stats-title">{data.name}</span>
        <span className="stats-header-spacer" />
      </div>
      <div className="stats-content">
        <div className="fiber-stats-chart">
          <Pie {...pieConfig} />
        </div>
        <div className="fiber-stats-legend stats-scrollable">
          {pieData.map((item, index) => (
            <div className="fiber-stats-legend-item" key={item.name}>
              <div className="fiber-stats-legend-left">
                <span
                  className="fiber-stats-legend-color"
                  style={{ background: item.color }}
                ></span>
                <span className="fiber-stats-legend-label">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiberResourceStats;
