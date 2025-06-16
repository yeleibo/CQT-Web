import React from 'react';
import { ChaoqianBoxPortDto, BoxPortType } from '@/store/types';
import { useAppDispatch } from '@/store/hooks';
import * as G6 from '@antv/g6';

interface FatBoxProps {
  chaoqianBoxPorts: ChaoqianBoxPortDto[];
}

const FatBox: React.FC<FatBoxProps> = ({ chaoqianBoxPorts }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const graphRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!containerRef.current || graphRef.current) return;

    const width = 350;
    const height = 190;
    
    // 根据端口状态获取颜色
    const getPortStatusColor = (status: string) => {
      switch (status) {
        case 'Linked':
          return '#52c41a';
        case 'Error':
          return '#ff4d4f';
        default:
          return '#d9d9d9';
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
    } as any);

    // 注册自定义节点
    (G6 as any).registerNode(
      'fat-box-port',
      {
        draw(cfg: any, group: any) {
          const { port } = cfg;
          const width = 25;
          const height = 25;
          const color = getPortStatusColor(port.status);
          
          // 绘制矩形端口
          const keyShape = group.addShape('rect', {
            attrs: {
              x: -width / 2,
              y: -height / 2,
              width,
              height,
              fill: color,
              stroke: port.isOuterContainerBorderVisible ? '#52c41a' : color,
              lineWidth: 2,
              radius: 4,
            },
            name: 'port-shape',
          });
          
          // 添加端口编号
          group.addShape('text', {
            attrs: {
              text: port.name,
              x: 0,
              y: 0,
              textAlign: 'center',
              textBaseline: 'middle',
              fill: '#fff',
              fontSize: 12,
            },
            name: 'port-label',
          });
          
          return keyShape;
        },
      },
      'single-node',
    );

    // 处理节点数据
    const outputPorts = chaoqianBoxPorts.filter(
      (port) => port.type === BoxPortType.output
    );
    
    const inputPort = chaoqianBoxPorts.find(
      (port) => port.type === BoxPortType.input
    );

    const data = {
      nodes: [
        // 输入端口
        ...(inputPort ? [{
          id: `port-${inputPort.id}`,
          x: inputPort.x * (width / 100),
          y: inputPort.y * (height / 100),
          type: 'fat-box-port',
          port: inputPort,
        }] : []),
        
        // 输出端口
        ...outputPorts.map((port) => ({
          id: `port-${port.id}`,
          x: port.x * (width / 100),
          y: port.y * (height / 100),
          type: 'fat-box-port',
          port,
        })),
      ],
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

export default FatBox; 