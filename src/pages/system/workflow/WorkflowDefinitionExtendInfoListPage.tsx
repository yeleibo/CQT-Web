import DeleteButton from '@/components/DelectButton';
import {
  getWorkflowDefinitionTypeLabel,
  WorkflowDefinitionExtendInfo,
  WorkflowDefinitionExtendInfosQueryParam,
} from '@/pages/system/workflow/typings';
import WorkflowDefinitionExtendInfoAddPage from '@/pages/system/workflow/WorkflowDefinitionExtendInfoAddPage';
import WorkflowDefinitionService from '@/pages/system/workflow/WorkflowDefinitionService';
import WorkflowDefinitionTypeSelect from '@/pages/system/workflow/WorkflowDefinitionTypeSelect';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useMemo, useRef, useState } from 'react';

const WorkflowDefinitionExtendInfoListPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [current, setCurrent] = useState<WorkflowDefinitionExtendInfo | undefined>();
  const [isAddPage, setIsAddPage] = useState<boolean>(false);
  const [isDesignPage, setIsDesignPage] = useState<boolean>(false);

  const openAddPage = (record?: WorkflowDefinitionExtendInfo) => {
    setCurrent(record);
    setIsAddPage(true);
  };

  const closeAddPage = () => {
    setCurrent(undefined);
    setIsAddPage(false);
  };

  const openDesignPage = (record?: WorkflowDefinitionExtendInfo) => {
    setCurrent(record);
    setIsDesignPage(true);
  };

  const closeDesignPage = () => {
    setIsDesignPage(false);
    setCurrent(undefined);
  };

  const columns: ProColumns<WorkflowDefinitionExtendInfo>[] = useMemo(
    () => [
      {
        title: '关键字',
        dataIndex: 'keyword',
        valueType: 'textarea',
        hideInTable: true,
      },
      {
        title: '流程类型',
        dataIndex: 'type',
        valueType: 'select',
        hideInTable: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        renderFormItem: (_, { defaultRender, ...rest }, form) => (
          <WorkflowDefinitionTypeSelect
            {...rest}
            onChange={(value) => form.setFieldValue(_.dataIndex, value)}
          ></WorkflowDefinitionTypeSelect>
        ),
      },
      {
        title: '流程名称',
        dataIndex: 'name',
        valueType: 'textarea',
        search: false,
        width: 200,
      },
      {
        title: '类型',
        dataIndex: 'type',
        valueType: 'textarea',
        search: false,
        width: 150,
        render: (text, record) => {
          return getWorkflowDefinitionTypeLabel(record.type);
        },
      },
      {
        title: '所属部门',
        dataIndex: 'organizeNames',
        valueType: 'textarea',
        search: false,
        ellipsis: true,
        width: 500,
        render: (text, record) => {
          return record.organizeNames!.map((e) => e).join(',');
        },
      },
      {
        title: '设计状态',
        dataIndex: 'organizeNames',
        valueType: 'textarea',
        search: false,
        width: 150,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        valueType: 'textarea',
        search: false,
        width: 250,
      },
      {
        title: '操作',
        valueType: 'option',
        width: 200,
        fixed: 'right',
        render: (_, record) => [
          <Button type="link" onClick={() => openAddPage(record)} key="edit" style={{ padding: 0 }}>
            编辑
          </Button>,
          <DeleteButton
            key="delete"
            onDelete={async () => {
              await WorkflowDefinitionService.delete(record.id!);
              await actionRef.current?.reload();
            }}
          />,
          <Button
            type={'link'}
            onClick={() => openDesignPage(record)}
            key="view1"
            style={{ padding: 0 }}
          >
            设计
          </Button>,
        ],
      },
    ],
    [],
  );

  return (
    <PageContainer pageHeaderRender={false}>
      <ProTable<WorkflowDefinitionExtendInfo, WorkflowDefinitionExtendInfosQueryParam>
        actionRef={actionRef}
        pagination={{ pageSize: 10 }}
        headerTitle={
          <Button onClick={() => openAddPage()} type="primary" style={{ marginRight: 8 }}>
            <PlusOutlined /> 新建
          </Button>
        }
        rowKey="id"
        search={{ labelWidth: 120 }}
        columns={columns}
        // scroll={{ x: 1000 }}
        request={async (params) => {
          const result = await WorkflowDefinitionService.all(params);
          return { data: result, success: true, total: result.length };
        }}
      />
      {isAddPage && (
        <WorkflowDefinitionExtendInfoAddPage
          close={closeAddPage}
          model={!current ? 'add' : 'edit'}
          data={current}
          open={isAddPage}
          reload={() => actionRef.current?.reload()}
        />
      )}
      {/*{isDesignPage && (*/}
      {/*  <RoleUserSelect*/}
      {/*    open={isDesignPage}*/}
      {/*    close={closeDesignPage}*/}
      {/*    role={state.current!}*/}
      {/*    reload={() => actionRef.current?.reload()}*/}
      {/*  />*/}
      {/*)}*/}
    </PageContainer>
  );
};

export default WorkflowDefinitionExtendInfoListPage;
