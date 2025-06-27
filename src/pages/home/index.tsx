import FiberResourceStats from '@/pages/home/FiberResourceStats';
import HomeHeader from '@/pages/home/HomeHeader';
import React, { useCallback, useEffect, useState } from 'react';
import './home.css';
import RecentAlerts from './RecentAlerts';
import ResourceMap from '@/pages/home/ResourceMap';
import ProjectService from '@/pages/project/ProjectService';
import { DailyInstallation, ProjectDto, ResourceData, ResourceStatistic } from '@/pages/project/type';
import { message } from 'antd';

const HomePage: React.FC = () => {
  // 项目列表状态
  const [projectList, setProjectList] = useState<ProjectDto[]>([]);
  // 当前选中的项目ID
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  // 资源统计数据
  const [resourceData, setResourceData] = useState<ResourceData | null>(null);
  // 加载状态
  const [loading, setLoading] = useState(false);

  // 获取项目相关数据
  const fetchProjectData = async (projectId: number) => {
    if (!projectId) return;

    setLoading(true);
    try {
      // 获取项目统计数据
      const data = await ProjectService.getProjectStatistics(projectId);
      setResourceData(data);
    } catch (e) {
      console.error('获取项目数据失败:', e);
      message.error('获取项目数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取项目列表
  const fetchProjectList = useCallback(async () => {
    try {
      // 获取项目列表
      const projectsData = await ProjectService.getProjectList({});
      if (projectsData && Array.isArray(projectsData)) {
        setProjectList(projectsData);
        // 如果有项目，默认选中第一个并获取相关数据
        if (projectsData.length > 0) {
          setSelectedProjectId(projectsData[0].id);
          await fetchProjectData(projectsData[0].id);
        }
      }
    } catch (e) {
      console.error('获取项目列表失败:', e);
      message.error('获取项目列表失败');
    }
  }, []);

  // 处理项目选择变化
  const handleProjectChange = async (projectId: number) => {
    setSelectedProjectId(projectId);
    await fetchProjectData(projectId);
  };

  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);

  // 在组件挂载和窗口大小变化时重新计算高度
  useEffect(() => {
    const adjustLayout = () => {
      const rightPanel = document.querySelector('.dataRight');
      if (rightPanel) {
        // 强制更新布局
        rightPanel.classList.add('force-relayout');
        setTimeout(() => {
          rightPanel.classList.remove('force-relayout');
        }, 0);
      }
    };

    adjustLayout();
    window.addEventListener('resize', adjustLayout);
    return () => window.removeEventListener('resize', adjustLayout);
  }, []);

  return (
    <>
      <div>
        <div
          style={{
            backgroundImage: `url(${require('@/assets/home/home_bg.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#505050',
            position: 'absolute',
            zIndex: 10,
            flexDirection: 'column',
            width: '100%',
            height: '100%',
          }}
        ></div>
        <div className="main-body">
          <HomeHeader
            projectList={projectList}
            selectedProjectId={selectedProjectId}
            onProjectChange={handleProjectChange}
          />
          <div className="main-container">
            <div className="dataLeft">
              {resourceData?.resourceStatistics?.map((statistic, index) => (
                <div key={`stat-${index}`} className="stats-item">
                  <FiberResourceStats data={statistic} />
                </div>
              ))}
            </div>
            <div className="dataCenter">
              <div className="stats-card">
                <ResourceMap projectId={selectedProjectId} />
              </div>
            </div>
            <div className="dataRight">
              {resourceData && <RecentAlerts data={resourceData.dailyInstallations || []} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
