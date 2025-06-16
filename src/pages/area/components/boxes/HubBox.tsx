import React from 'react';
import { ChaoqianBoxPortDto, BoxPortType } from '@/store/types';
import { useAppDispatch } from '@/store/hooks';
import * as G6 from '@antv/g6';

interface HubBoxProps {
  chaoqianBoxPorts: ChaoqianBoxPortDto[];
}

const HubBox: React.FC<HubBoxProps> = ({ chaoqianBoxPorts }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const graphRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!containerRef.current || graphRef.current) return;

    // 创建G6图形实例
    const width = 350;
    const height = 190;
    
    // 根据端口类型获取不同的颜色
    const getPortColor = (port: ChaoqianBoxPortDto) => {
      switch (port.type) {
        case BoxPortType.input:
          return '#f15a25'; // 输入端口为橙色
        case BoxPortType.cascade:
          return port.oppositePortId ? '#9c27b0' : '#d9d9d9'; // 级联端口为紫色
        case BoxPortType.output:
          return port.oppositePortId ? '#52c41a' : '#d9d9d9'; // 输出端口为绿色
        default:
          return '#d9d9d9';
      }
    };
    
    // 获取端口的形状
    const getPortShape = (port: ChaoqianBoxPortDto) => {
      switch (port.type) {
        case BoxPortType.input:
          return 'triangle'; // 输入端口为三角形
        case BoxPortType.cascade:
          return 'diamond'; // 级联端口为菱形
        case BoxPortType.output:
          return 'circle'; // 输出端口为圆形
        default:
          return 'circle';
      }
    };
    
    // 初始化G6图
    const graph = new G6.Graph({
      container: containerRef.current,
      width,
      height,
      modes: {
        default: ['drag-canvas', 'zoom-canvas'],
      },
      defaultNode: {
        type: 'node',
        size: 20,
        style: {
          fill: '#91d5ff',
          stroke: '#40a9ff',
          lineWidth: 2,
        },
        labelCfg: {
          style: {
            fill: '#000',
            fontSize: 12,
          },
        },
      },
      defaultEdge: {
        type: 'line',
        style: {
          stroke: '#91d5ff',
          lineWidth: 2,
          endArrow: true,
        },
      },
    } as any);

    // 注册自定义节点
    (G6 as any).registerNode(
      'port-node',
      {
        draw(cfg: any, group: any) {
          const { port } = cfg;
          const shape = getPortShape(port);
          const color = getPortColor(port);
          const width = 30;
          const height = 30;
          
          let keyShape;
          
          if (shape === 'circle') {
            keyShape = group.addShape('circle', {
              attrs: {
                x: 0,
                y: 0,
                r: width / 2,
                fill: color,
                stroke: port.isOuterContainerBorderVisible ? '#52c41a' : 'transparent',
                lineWidth: 2,
              },
              name: 'port-shape',
            });
          } else if (shape === 'triangle') {
            keyShape = group.addShape('polygon', {
              attrs: {
                points: [
                  [0, -height / 2],
                  [width / 2, height / 2],
                  [-width / 2, height / 2],
                ],
                fill: color,
                stroke: port.isOuterContainerBorderVisible ? '#52c41a' : 'transparent',
                lineWidth: 2,
              },
              name: 'port-shape',
            });
          } else if (shape === 'diamond') {
            keyShape = group.addShape('polygon', {
              attrs: {
                points: [
                  [0, -height / 2],
                  [width / 2, 0],
                  [0, height / 2],
                  [-width / 2, 0],
                ],
                fill: color,
                stroke: port.isOuterContainerBorderVisible ? '#52c41a' : 'transparent',
                lineWidth: 2,
              },
              name: 'port-shape',
            });
          }
          
          // 添加端口编号
          group.addShape('text', {
            attrs: {
              text: port.name,
              x: 0,
              y: 0,
              textAlign: 'center',
              textBaseline: 'middle',
              fill: port.oppositePortId ? '#fff' : '#000',
              fontSize: 12,
            },
            name: 'port-label',
          });
          
          return keyShape;
        },
      },
      'single-node',
    );

    // 节点数据
    const data = {
      nodes: chaoqianBoxPorts.map((port) => ({
        id: `port-${port.id}`,
        x: port.x * (width / 100),
        y: port.y * (height / 100),
        type: 'port-node',
        port,
      })),
      edges: [],
    };

    (graph as any).data(data);
    graph.render();
    
    // 添加节点点击事件
    graph.on('node:click', (evt: any) => {
      const { item } = evt;
      const node = item.getModel();
      console.log('点击了端口:', node.port);
    });

    graphRef.current = graph;

    return () => {
      if (graphRef.current) {
        graphRef.current.destroy();
        graphRef.current = null;
      }
    };
  }, [chaoqianBoxPorts]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: 350, 
        height: 190, 
        border: '1px solid #f0f0f0',
        borderRadius: 4,
      }}
    />
  );
};

export default HubBox; 