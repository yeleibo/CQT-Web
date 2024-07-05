import DeleteButton from '@/components/DelectButton';
import PermissionSelectDialog from '@/pages/organize-manage/role/PermissionSelectDialog';
import RoleAddPage from '@/pages/organize-manage/role/RoleAddPage';
import RoleService from '@/pages/organize-manage/role/RoleService';
import { RoleList, RolesQueryParam } from '@/pages/organize-manage/role/RoleTypings';
import RoleUserSelect from '@/pages/organize-manage/role/RoleUserSelect';
import { useIntl } from '@@/plugin-locale';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useMemo, useRef, useState } from 'react';

const RoleListPage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [state, setState] = useState({
    current: undefined as RoleList | undefined,
    isAddPage: false,
    isRoleUser: false,
    isRolePermission: false,
  });

  const intl = useIntl();

  const openAddPage = (record?: RoleList) => {
    setState((prevState) => ({ ...prevState, current: record, isAddPage: true }));
  };

  const closeAddPage = () => {
    setState((prevState) => ({ ...prevState, current: undefined, isAddPage: false }));
  };

  const openRoleUserDialog = (record?: RoleList) => {
    setState((prevState) => ({ ...prevState, current: record, isRoleUser: true }));
  };

  const closeRoleUserDialog = () => {
    setState((prevState) => ({ ...prevState, current: undefined, isRoleUser: false }));
  };

  const openRolePermissionDialog = (record?: RoleList) => {
    setState((prevState) => ({ ...prevState, current: record, isRolePermission: true }));
  };

  const closeRolePermissionDialog = () => {
    setState((prevState) => ({ ...prevState, current: undefined, isRolePermission: false }));
  };

  const columns: ProColumns<RoleList>[] = useMemo(
    () => [
      {
        title: intl.formatMessage({ id: 'keyword' }),
        dataIndex: 'keyword',
        valueType: 'textarea',
        hideInTable: true,
      },
      {
        title: intl.formatMessage({ id: 'roleName' }),
        dataIndex: 'name',
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
        title: intl.formatMessage({ id: 'remark' }),
        dataIndex: 'remark',
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
              await RoleService.delete(record.id!);
              await actionRef.current?.reload();
            }}
          />,
          <Button
            type={'link'}
            onClick={() => openRoleUserDialog(record)}
            key="view1"
            style={{ padding: 0 }}
          >
            {intl.formatMessage({ id: 'roleMember' })}
          </Button>,
          <Button
            type={'link'}
            onClick={() => openRolePermissionDialog(record)}
            key="view2"
            style={{ padding: 0 }}
          >
            {intl.formatMessage({ id: 'rolePermissions' })}
          </Button>,
        ],
      },
    ],
    [],
  );

  return (
    <PageContainer pageHeaderRender={false}>
      <ProTable<RoleList, RolesQueryParam>
        actionRef={actionRef}
        pagination={{ pageSize: 10 }}
        headerTitle={
          <Button onClick={() => openAddPage()} type="primary" style={{ marginRight: 8 }}>
            <PlusOutlined /> {intl.formatMessage({ id: 'add' })}
          </Button>
        }
        rowKey="id"
        search={{ labelWidth: 120 }}
        columns={columns}
        request={async (params) => {
          const result = await RoleService.all(params);
          return { data: result.data, success: true, total: result.total };
        }}
      />
      {state.isAddPage && (
        <RoleAddPage
          close={closeAddPage}
          model={
            !state.current ? intl.formatMessage({ id: 'add' }) : intl.formatMessage({ id: 'edit' })
          }
          data={state.current}
          open={state.isAddPage}
          reload={() => actionRef.current?.reload()}
        />
      )}
      {state.isRoleUser && (
        <RoleUserSelect
          open={state.isRoleUser}
          close={closeRoleUserDialog}
          role={state.current!}
          reload={() => actionRef.current?.reload()}
        />
      )}
      {state.isRolePermission && (
        <PermissionSelectDialog
          open={state.isRolePermission}
          close={closeRolePermissionDialog}
          role={state.current!}
          reload={() => actionRef.current?.reload()}
        />
      )}
    </PageContainer>
  );
};

export default RoleListPage;
