import DeleteButton from '@/components/DelectButton';
import ExportButton from '@/components/ExcelButton/ExportButton';
import UserService from '@/pages/organize-manage/user/UserService';
import ProjectService from '@/pages/project/ProjectService';
import { ProjectDto, ProjectStatisticsQueryParam } from '@/pages/project/type';
import chaoqianService from '@/pages/topology/chaoqianService';
import {
  ChaoqianBoxDto,
  ChaoqianTopologyParam,
  chaoqianBoxDtoHeaders,
} from '@/pages/topology/type';
import { useIntl } from '@@/plugin-locale';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import ProjectDetailPage from '@/pages/project/ProjectDetailPage';

const ProjectListPage: React.FC = () => {
  const [projectDto, setProjectDto] = useState<ProjectDto>();
  const [list, setList] = useState<boolean>(true);
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const columns: ProColumns<ProjectDto>[] = [
    {
      title: intl.formatMessage({ id: 'keyword' }),
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },

    {
      title: intl.formatMessage({ id: 'index' }),
      valueType: 'text',
      search: false,
      render: (text, record, index) => index + 1,
    },
    {
      title: intl.formatMessage({ id: 'areaName' }),
      dataIndex: 'name',
      valueType: 'text',
      search: false,
    },
    {
      title: intl.formatMessage({ id: 'status' }),
      valueType: 'text',
      search: false,
      render: (text, record) =>
        record.status === ''
          ? intl.formatMessage({ id: 'unSubmitted' })
          : intl.formatMessage({ id: 'submitted' }),
    },
    {
      title: intl.formatMessage({ id: 'operate' }),
      valueType: 'option',
      fixed: 'right',
      width: 300,
      render: (_, record) => [
        <Button type="link" onClick={() => {
          setProjectDto(record);
          setList(false);
        }} key="edit" style={{ padding: 0 }}>
          {intl.formatMessage({ id: 'edit' })}
        </Button>,
        <ExportButton
          key="export"
          type="link"
          fileName={record.name}
          headers={chaoqianBoxDtoHeaders}
          fetchData={async (): Promise<{ [sheetName: string]: ChaoqianBoxDto[] }> => {
            let params: ChaoqianTopologyParam = {
              areaId: record.id,
            };
            let r = await chaoqianService.getChaoqianTopology(params);
            return { [record.name]: r.boxes };
          }}
          buttonName={intl.formatMessage({ id: 'export' })}
        ></ExportButton>,
        <Button type="link" onClick={async () => {
          try {
            await ProjectService.updateProjectStatistics({
              ...record,
              status: '1'
            });
            message.success(intl.formatMessage({ id: 'submitSuccess' }));
            actionRef.current?.reload();
          } catch (error) {
            console.error('提交失败:', error);
            message.error(intl.formatMessage({ id: 'submitFailed' }));
          }
        }} key="submit" style={{ padding: 0 }}>
          {intl.formatMessage({ id: 'submit' })}
        </Button>,
        <DeleteButton
          key="delete"
          onDelete={async () => {
            await UserService.delete(record.id!);
            actionRef.current?.reload();
          }}
        />,
      ],
    },
  ];
  // 项目列表页面

  return (
    <>
      {list ? (
        <PageContainer pageHeaderRender={false} style={{margin: '20px'}}>
          <ProTable<ProjectDto, ProjectStatisticsQueryParam>
            actionRef={actionRef}
            pagination={{ pageSize: 10 }}
            headerTitle={
              <Button onClick={() => {
                setProjectDto(undefined);
                setList(false);
              }} type="primary" style={{ marginRight: 8 }}>
                <PlusOutlined /> {intl.formatMessage({ id: 'add' })}
              </Button>
            }
            rowKey="id"
            search={{ labelWidth: 120 }}
            columns={columns}
            request={async (params) => {
              const areas = await ProjectService.getProjectList(params);
              return { data: areas, success: true, total: areas.length };
            }}
          />
        </PageContainer>
      ) : (
        <ProjectDetailPage
          id={projectDto?.id}
          projectData={projectDto}
          onClose={() => {
            setList(true);
            actionRef.current?.reload();
          }}
        />
      )}
    </>
  );
};

export default ProjectListPage;
