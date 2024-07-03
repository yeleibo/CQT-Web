import DeleteButton from '@/components/DelectButton';
import CommonSelectDialog from '@/pages/organize-manage/common';
import OrganizeSelectDialog from '@/pages/organize-manage/organize/OrganizeSelectDialog';
import MessageSendDialog from '@/pages/organize-manage/user/MessageSendDialog';
import UserAddPage from '@/pages/organize-manage/user/UserAddPage';
import UserService from '@/pages/organize-manage/user/UserService';
import {
  UserItem,
  UsersQueryParam,
} from '@/pages/organize-manage/user/UserTypings';
import { PlusOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';

const UserListPage: React.FC = () => {
  const [current, setCurrent] = useState<UserItem | undefined>();
  const [isAddPage, setIsAddPage] = useState<boolean>(false);
  const [isMessageSend, setIsMessageSend] = useState<boolean>(false);
  const [isOrganizeSelect, setIsOrganizeSelect] = useState<boolean>(false);
  const [isHouseSelect, setHouseSelectDialog] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const openAddPage = (record?: UserItem) => {
    setCurrent(record);
    setIsAddPage(true);
  };

  const closeAddPage = () => {
    setCurrent(undefined);
    setIsAddPage(false);
  };
  const closeMessageDialog = () => {
    setIsMessageSend(false);
    setCurrent(undefined);
  };
  const closeOrganizeDialog = async () => {
    setIsOrganizeSelect(false);
    setCurrent(undefined);
  };
  const closeHouseDialog = async () => {
    setHouseSelectDialog(false);
    setCurrent(undefined);
  };

  const columns: ProColumns<UserItem>[] = [
    {
      title: '账号 | 姓名',
      dataIndex: 'keyword',
      valueType: 'textarea',
      hideInTable: true,
    },

    {
      title: '账号',
      dataIndex: 'account',
      valueType: 'textarea',
      search: false,
      width: 150,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'textarea',
      search: false,
      width: 100,
    },
    {
      title: '部门',
      dataIndex: 'organizeName',
      valueType: 'textarea',
      search: false,
      width: 100,
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 300,
      render: (_, record) => [
        <Button type="link" onClick={() => openAddPage(record)} key="edit" style={{ padding: 0 }}>
          编辑
        </Button>,
        <Button
          type="link"
          onClick={async () => {
            try {
              await UserService.resetPassWord(record.id!);
              message.success('操作成功');
              await actionRef.current?.reload();
            } catch (error) {
              message.error('操作失败');
            }
          }}
          key="reset"
          style={{ padding: 0 }}
        >
          密码重置
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
    <PageContainer pageHeaderRender={false}>
      <ProTable<UserItem, UsersQueryParam>
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
          const users = await UserService.all(params);
          return { data: users, success: true, total: users.length };
        }}
      />
      {isAddPage && (
        <UserAddPage
          close={closeAddPage}
          model={!current ? 'add' : 'edit'}
          data={current}
          open={isAddPage}
          reload={() => actionRef.current?.reload()}
        />
      )}
      {isMessageSend && current?.id && (
        <MessageSendDialog open={isMessageSend} close={closeMessageDialog} id={current.id} />
      )}
      {isOrganizeSelect && current?.id && (
        <OrganizeSelectDialog
          open={isOrganizeSelect}
          close={closeOrganizeDialog}
          reload={() => actionRef.current?.reload()}
          userId={current.id}
          organizeIds={
            current.userManagementOrganizes
              ? current.userManagementOrganizes.map((e) => e.organizeId)
              : []
          }
        />
      )}
    </PageContainer>
  );
};

export default UserListPage;
