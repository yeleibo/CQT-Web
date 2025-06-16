import React from 'react';
import { ChaoqianBoxPortDto } from '@/store/types';
import { useAppDispatch } from '@/store/hooks';
import * as G6 from '@antv/g6';

interface XBoxProps {
  chaoqianBoxPorts: ChaoqianBoxPortDto[];
}

const XBox: React.FC<XBoxProps> = ({ chaoqianBoxPorts }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const graphRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!containerRef.current || graphRef.current) return;

    // 创建G6图形实例
    const width = 350;
    const height = 190;
    
    const graph = new G6.Graph({
      container: containerRef.current,
      width,
      height,
      modes: {
        default: ['drag-canvas', 'zoom-canvas'],
      },
      defaultNode: {
        type: 'circle',
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

    // 节点数据
    const data = {
      nodes: chaoqianBoxPorts.map((port) => ({
        id: `port-${port.id}`,
        x: port.x * (width / 100),
        y: port.y * (height / 100),
        label: port.name,
        style: {
          fill: port.status === 'Error' ? '#ff4d4f' : 
                port.status === 'Linked' ? '#52c41a' : '#d9d9d9',
        },
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

export default XBox; 