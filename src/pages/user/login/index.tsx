
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import {Alert, message} from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import './login.css';
import Service from "@/pages/user/login/service";
import Token from "@/utils/token";
import {useIntl} from "@@/plugin-locale";
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: "url('/web_login_bg.png')",
      backgroundSize: '100% 100%',
    },
  };
});
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const intl = useIntl();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s: any) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleSubmit = async (values: LoginParam) => {
      //用户明和密码缓存
      if(values.username!==null){
        localStorage.setItem("username",values.username!);
      }
      if(values.password!==null){
        localStorage.setItem("password",values.password);
      }

      // 登录
      const loginInfo = await Service.login({
        ...values,
      });

       Token.set(loginInfo.token);
        message.success(intl.formatMessage({ id: 'loginSuccessful' }));
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;

      // 如果失败去设置用户错误信息
      setUserLoginState(loginInfo);

  };
  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {intl.formatMessage({ id: 'login' })}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
          marginTop:'250px'
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          submitter={{
            searchConfig: {
              submitText: intl.formatMessage({ id: 'login' }), // 修改登录按钮的文本为"登录"
            },
          }}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as LoginParam);
          }}
        >
          {status === 'error' && loginType === 'account' && (
            <LoginMessage content={`${intl.formatMessage({ id: 'loginError' })}(admin/ant.design)`} />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                initialValue={ localStorage.getItem("username")}
                fieldProps={{
                  size: 'large',
                  style: {
                    height: '50px',
                  },
                  prefix: <UserOutlined />,
                }}
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({ id: 'userRequired' })}！`,
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                initialValue={ localStorage.getItem("password")}
                fieldProps={{
                  size: 'large',
                  style: {
                    height: '50px',
                  },
                  prefix: <LockOutlined />,
                }}
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({id:'passwordRequired'})}！`,
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
    </div>
  );
};
export default Login;
