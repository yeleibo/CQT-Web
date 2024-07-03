import DeleteButton from '@/components/DelectButton';
import AddPage from '@/pages/Designable/AddPage';
import DesignableService from '@/pages/Designable/DesignableService';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ParamsType,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';

const DesignableListPage: React.FC = () => {
  const [current, setCurrent] = useState<Record<string, any> | undefined>();
  const [isAddPage, setIsAddPage] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const openAddPage = (record?: Record<string, any>) => {
    setCurrent(record);
    setIsAddPage(true);
  };

  const closeAddPage = () => {
    setCurrent(undefined);
    setIsAddPage(false);
  };

  const columns: ProColumns<Record<string, any>>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '编码',
      dataIndex: 'code',
      valueType: 'textarea',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (_, record) => [
        <Button
          type="link"
          onClick={() => {
            openAddPage(record);
          }}
          key="view"
          style={{ padding: 0 }}
        >
          编辑
        </Button>,
        <DeleteButton
          key="delete"
          onDelete={async () => {
            await DesignableService.delete(record.id!);
            await actionRef.current?.reload();
          }}
        ></DeleteButton>,
      ],
    },
  ];

  return (
    <PageContainer pageHeaderRender={false}>
      <ProTable<Record<string, any>, ParamsType>
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
        request={async (params) => {
          const data = await DesignableService.all(params);
          return { data: data, success: true, total: data.length };
        }}
      />
      {isAddPage && (
        <AddPage
          close={closeAddPage}
          model={!current ? 'add' : 'edit'}
          data={current}
          open={isAddPage}
          reload={() => actionRef.current?.reload()}
        />
      )}
    </PageContainer>
  );
};

export default DesignableListPage;
