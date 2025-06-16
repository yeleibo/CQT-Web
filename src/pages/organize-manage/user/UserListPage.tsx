import DeleteButton from '@/components/DelectButton';

import UserAddPage from '@/pages/organize-manage/user/UserAddPage';
import UserService from '@/pages/organize-manage/user/UserService';
import { UserItem, UsersQueryParam } from '@/pages/organize-manage/user/UserTypings';
import { useIntl } from '@@/plugin-locale';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';

const UserListPage: React.FC = () => {
  const [current, setCurrent] = useState<UserItem | undefined>();
  const [isAddPage, setIsAddPage] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const intl = useIntl();

  const openAddPage = (record?: UserItem) => {
    setCurrent(record);
    setIsAddPage(true);
  };

  const closeAddPage = () => {
    setCurrent(undefined);
    setIsAddPage(false);
  };

  const columns: ProColumns<UserItem>[] = [
    {
      title: `${intl.formatMessage({ id: 'account' })} | ${intl.formatMessage({ id: 'name' })}`,
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },

    {
      title: intl.formatMessage({ id: 'account' }),
      dataIndex: 'account',
      valueType: 'textarea',
      search: false,
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'name' }),
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'department' }),
      dataIndex: 'organizeName',
      valueType: 'textarea',
      search: false,
      width: 100,
    },
    {
      title: intl.formatMessage({ id: 'operate' }),
      valueType: 'option',
      fixed: 'right',
      width: 300,
      render: (_, record) => [
        <Button type="link" onClick={() => openAddPage(record)} key="edit" style={{ padding: 0 }}>
          {intl.formatMessage({ id: 'edit' })}
        </Button>,
        <Button
          type="link"
          onClick={async () => {
            try {
              await UserService.resetPassWord(record.id!);
              message.success(intl.formatMessage({ id: 'successOpera' }));
              await actionRef.current?.reload();
            } catch (error) {
              message.error(intl.formatMessage({ id: 'failedOpera' }));
            }
          }}
          key="reset"
          style={{ padding: 0 }}
        >
          {intl.formatMessage({ id: 'resetPassword' })}
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

  return (
    <PageContainer pageHeaderRender={false} style={{margin: '20px'}}>
      <ProTable<UserItem, UsersQueryParam>
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
          const users = await UserService.all(params);
          return { data: users, success: true, total: users.length };
        }}
      />
      {isAddPage && (
        <UserAddPage
          close={closeAddPage}
          model={!current ? intl.formatMessage({ id: 'add' }) : intl.formatMessage({ id: 'edit' })}
          data={current}
          open={isAddPage}
          reload={() => actionRef.current?.reload()}
        />
      )}
    </PageContainer>
  );
};

export default UserListPage;
