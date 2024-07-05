import DeleteButton from '@/components/DelectButton';
import OrganizeAddPage from '@/pages/organize-manage/organize/OrganizeAddPage';
import OrganizeService from '@/pages/organize-manage/organize/OrganizeService';
import {
  OrganizeItem,
  getOrganizeTypeLabel,
  organizeToTreeDataType,
} from '@/pages/organize-manage/organize/OrganizeTypings';
import { UsersQueryParam } from '@/pages/organize-manage/user/UserTypings';
import { useIntl } from '@@/plugin-locale';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, TreeDataNode } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactEcharts from 'echarts-for-react';

const OrganizeListPage: React.FC = () => {
  const [state, setState] = useState({
    current: undefined as OrganizeItem | undefined,
    isAddPage: false,
    userTreeData: [] as TreeDataNode[],
    allOrganize: [] as OrganizeItem[],
  });

  const intl = useIntl();

  const actionRef = useRef<ActionType>();

  const openAddPage = (record?: OrganizeItem) => {
    setState((prevState) => ({ ...prevState, current: record, isAddPage: true }));
  };

  const closeAddPage = () => {
    setState((prevState) => ({ ...prevState, current: undefined, isAddPage: false }));
  };

  const fetchData = async () => {
    let organize = await OrganizeService.all();
    if (organize.length !== 0) {
      organize = organize.map((item, index) => ({ ...item, key: item.id || `key-${index}` }));

      const userTreeData = organizeToTreeDataType(organize);
      setState((prevState) => ({ ...prevState, allOrganize: organize, userTreeData }));
      return { data: userTreeData, success: true, total: organize.length };
    }
    return { data: [], success: true, total: 0 };
  };


  useEffect(() => {
    fetchData();
  }, []);

  const getAllKeys = (nodes: any[]) => {
    let keys: any[] = [];
    nodes.forEach((node) => {
      keys.push(node.key);
      if (node.children && node.children.length > 0) {
        keys = keys.concat(getAllKeys(node.children));
      }
    });
    return keys;
  };

  const columns: ProColumns<OrganizeItem>[] = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'name' }),
        dataIndex: 'name',
        valueType: 'textarea',
        search: false,
      },
      {
        title: intl.formatMessage({ id: 'type' }),
        dataIndex: 'type',
        valueType: 'textarea',
        search: false,
        render: (_, record) => getOrganizeTypeLabel(record.type),
      },
      {
        title: intl.formatMessage({ id: 'masterName' }),
        dataIndex: 'masterName',
        valueType: 'textarea',
        search: false,
      },
      {
        title: intl.formatMessage({ id: 'sort' }),
        dataIndex: 'orderNumber',
        valueType: 'textarea',
        search: false,
      },
      {
        title: intl.formatMessage({ id: 'operate' }),
        valueType: 'option',
        width: 200,
        fixed: 'right',
        render: (_, record) => [
          <Button type="link" onClick={() => openAddPage(record)} key="edit" style={{ padding: 0 }}>
            {intl.formatMessage({ id: 'edit' })}
          </Button>,
          <DeleteButton
            key="delete"
            onDelete={async () => {
              await OrganizeService.delete(record.id!);
              await actionRef.current?.reload();
            }}
          />,
        ],
      },
    ],
    [],
  );

  return (
    <><PageContainer pageHeaderRender={false}>
      <ProTable<OrganizeItem, UsersQueryParam>
        actionRef={actionRef}
        // 隐藏分页器
        pagination={false}
        headerTitle={
          <Button onClick={() => openAddPage()} type="primary" style={{ marginRight: 8 }}>
            <PlusOutlined /> {intl.formatMessage({ id: 'add' })}
          </Button>
        }
        search={{ labelWidth: 120 }}
        columns={columns}
        indentSize={50}
        scroll={{ x: 1500 }}
        rowKey="key"
        expandable={{
          expandIcon: () => null,
          defaultExpandAllRows: true,
          expandedRowKeys: getAllKeys(state.userTreeData),
        }}
        request={fetchData} />
      {state.isAddPage && (
        <OrganizeAddPage
          close={closeAddPage}
          model={
            !state.current ? intl.formatMessage({ id: 'add' }) : intl.formatMessage({ id: 'edit' })
          }
          data={state.current}
          open={state.isAddPage}
          reload={() => actionRef.current?.reload()} />
      )}
    </PageContainer></>
  );
};

export default OrganizeListPage;
