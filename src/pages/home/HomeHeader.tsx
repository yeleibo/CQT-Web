import React, { useEffect, useState } from 'react';
// @ts-ignore
import { useModel } from '@@/exports';
import { Select } from 'antd';
import { ProjectDto } from '@/pages/project/type';

// 定义组件props接口
interface HomeHeaderProps {
  projectList: ProjectDto[];
  selectedProjectId: number | null;
  onProjectChange: (projectId: number) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({ projectList, selectedProjectId, onProjectChange }) => {
  const { initialState } = useModel('@@initialState');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 格式化日期和时间
  const dateStr = `${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(currentTime.getDate()).padStart(2, '0')}`;
  const timeStr = `${String(currentTime.getHours()).padStart(2, '0')}:${String(
    currentTime.getMinutes(),
  ).padStart(2, '0')}:${String(currentTime.getSeconds()).padStart(2, '0')}`;

  return (
    <div className="home-header-root">
      <div
        className="home-header-content"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '70px',
          backgroundImage: `url(${require('@/assets/home/title_bg.png')})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '8px',
          position: 'relative',
        }}
      >
        <div
          className="home-header-left"
          style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '20px' }}
        ><div className="home-header-text">项目：</div>
          <Select
            style={{ width: 200 }}
            placeholder="请选择项目"
            value={selectedProjectId}
            onChange={(value) => onProjectChange(value)}
            options={projectList.map((project) => ({
              label: project.name,
              value: project.id,
            }))}
          />
        </div>
        <div
          className="home-header-title-container"
          style={{
            flex: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '48px',
          }}
        >
          <div
            className="home-header-title"
            style={{
              position: 'relative',
              zIndex: 1,
              background: 'transparent',
              backgroundImage: 'linear-gradient(to bottom, #B3DAFF, #1C83F9)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {initialState?.applicationConfig!.applicationName ?? ''}
          </div>
        </div>
        <div
          className="home-header-right"
          style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
        >
          <span className="home-header-text">{dateStr}</span>
          <span className="home-header-text">{timeStr}</span>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
