import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Spin, message } from 'antd';
import { createStyles } from 'antd-style';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import service from "@/pages/user/login/service"; // 引入 axios 或其他用于发送网络请求的库

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.user.name}</span>;
};

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
  };
});

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [formType, setFormType] = useState<'center' | 'settings'>('center');
  const [formData, setFormData] = useState({}); // 存储表单数据

  const loginOut = async () => {
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    const redirect = urlParams.get('redirect');
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  const { styles } = useStyles();
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s: any) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      }
      if (key === 'center') {
        setFormType('center');
        setModalTitle('个人中心');
        setModalVisible(true);
        return;
      }
      if (key === 'settings') {
        setFormType('settings');
        setModalTitle('修改密码');
        setModalVisible(true);
        return;
      }
      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={styles.action}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.user.name) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
        {
          key: 'center',
          icon: <UserOutlined />,
          label: '个人中心',
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: '修改密码',
        },
        {
          type: 'divider' as const,
        },
      ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleFinish = async (values:any) => {
    try {
      setFormData(values);
      if (formType === 'settings') {
        // 发送网络请求更新密码
        service.changePassword(values.confirmPassword)
        message.success('密码更新成功');
      } else {
        // 处理个人中心的其他表单提交
        message.success('信息更新成功');
      }
      setModalVisible(false);
    } catch (error) {
      message.error(`操作失败`);
    }
  };

  return (
    <>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
      <ModalForm
        title={modalTitle}
        open={modalVisible}
        onOpenChange={setModalVisible}
        onFinish={handleFinish}
      >
        {formType === 'center' && (
          <>
            <ProFormText
              name="name"
              label="姓名"
              disabled
              placeholder=''
              initialValue={currentUser.user.name}
            />
            <ProFormText
              name="account"
              label="账号"
              disabled
              placeholder=''
              initialValue={currentUser.user.account}
            />
            <ProFormText
              name="organizeName"
              label="部门"
              disabled
              placeholder=''
              initialValue={currentUser.user.organizeName}
            />
          </>

        )}
        {formType === 'settings' && (
          <>
            <ProFormText.Password
              name="newPassword"
              label="新密码"
              rules={[{ required: true, message: '请输入新密码' }]}
            />
            <ProFormText.Password
              name="confirmPassword"
              label="确认密码"
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            />
          </>
        )}
      </ModalForm>
    </>
  );
};
