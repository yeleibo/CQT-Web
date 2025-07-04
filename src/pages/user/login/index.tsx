import Service from '@/pages/user/login/service';
import { LoginParam } from '@/pages/user/login/user';
import Token from '@/utils/token';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { ProFormCheckbox } from '@ant-design/pro-form/lib';
import { Helmet, history, useModel } from '@umijs/max';
import { Alert, Flex, Image } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';
import './login.css';
import { createHash } from "crypto";
import { flushSync } from 'react-dom';


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
      flexDirection: 'column',
      justifyContent: 'center', // 垂直方向居中
      alignItems: 'center', // 水平方向居中
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: `url(${require('@/assets/home/login_background.png')})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    loginBox: {
      width: '50%',
      minWidth: '800px',
      maxWidth: '1200px',
      height: '60%',
      minHeight: '400px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
  const [scale, setScale] = useState(1);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const [rememberPassword, setRememberPassword] = useState<boolean>(
    localStorage.getItem('password') !== undefined && localStorage.getItem('password') !== null,
  );

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

  useEffect(() => {
    const handleResize = () => {
      const baseWidth = 1920; // 设计稿的基准宽度
      const currentWidth = window.innerWidth;
      // 计算缩放比例，但限制最小和最大值，防止过度缩放
      let newScale = currentWidth / baseWidth;
      // 限制缩放范围，避免过小或过大
      newScale = Math.max(0.7, Math.min(newScale, 1.2));
      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (values: LoginParam) => {
    //用户名和密码缓存
    if (values.account !== null) {
      localStorage.setItem('account', values.account!);
    }
    if (values.password !== null && rememberPassword) {
      localStorage.setItem('password', values.password);
    } else {
      localStorage.removeItem('password');
    }
    //是否需要修改密码
    const isChangePassword: boolean =
      values.password === 'abc@123456';

    setInitialState((s) => ({
      ...s,
      isChangePassword,
    }));
    // 登录
    const loginInfo = await Service.login({
      account: values.account,
      password: createHash("md5").update(values.password.toString(),"utf8").digest("hex")
    });

    Token.set(loginInfo.token);
    await fetchUserInfo();
    const urlParams = new URL(window.location.href).searchParams;
    const url = urlParams.get('redirect');
    history.push(url || '/');
    return;
  };
  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <Helmet>
        <title>{'登录'}</title>
      </Helmet>

      <div className={styles.loginBox}>
        <Flex
          align={'center'}
          justify={'center'}
          style={{
            width: '100%',
            height: '100%',
          }}
          vertical={false}
          gap={0}
        >
          <Image
            src="/login_logo.png"
            preview={false}
            height={'100%'}
            width={'50%'}
            style={{ objectFit: 'cover' }}
          />
          <div
            style={{
              width: '50%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <LoginForm
                contentStyle={{
                  minWidth: 280,
                  maxWidth: '100vw',
                }}
                title={
                  <div
                    style={{
                      color: 'black',
                      marginTop: '198px',
                      fontSize: '24px',
                      height: '80px', // 高度设置为 auto 以适应换行
                      maxWidth: '400px', // 设定极限宽度
                      textAlign: 'left', // 确保文本左对齐
                      wordWrap: 'break-word', // 允许单词内换行
                      whiteSpace: 'pre-wrap', // 保留空格并自动换行
                    }}
                  >
                    {initialState?.applicationConfig?.applicationName}
                  </div>
                }
                initialValues={{
                  autoLogin: true,
                }}
                onFinish={async (values) => {
                  await handleSubmit(values as LoginParam);
                }}
              >
                {status === 'error' && loginType === 'account' && (
                  <LoginMessage content={'错误的用户名和密码(admin/ant.design)'} />
                )}
                {type === 'account' && (
                  <div
                    style={{
                      marginTop: 144,
                    }}
                  >
                    <ProFormText
                      name="account"
                      initialValue={localStorage.getItem('account')}
                      fieldProps={{
                        size: 'large',
                        style: {
                          height: '50px',
                        },
                        prefix: <UserOutlined />,
                      }}
                      placeholder="用户名"
                      rules={[
                        {
                          required: true,
                          message: '用户名是必填项！',
                        },
                      ]}
                    />
                    <ProFormText.Password
                      name="password"
                      initialValue={localStorage.getItem('password')}
                      fieldProps={{
                        size: 'large',
                        style: {
                          height: '50px',
                        },
                        prefix: <LockOutlined />,
                      }}
                      placeholder="密码"
                      rules={[
                        {
                          required: true,
                          message: '密码是必填项！',
                        },
                      ]}
                    />
                    <ProFormCheckbox
                      name="remember"
                      fieldProps={{
                        checked: rememberPassword, // 控制是否勾选
                        onChange: (e) => {
                          const checked = e.target.checked;
                          setRememberPassword(checked);
                        },
                      }}
                    >
                      记住密码
                    </ProFormCheckbox>
                  </div>
                )}
              </LoginForm>
            </div>
          </div>
        </Flex>
      </div>
    </div>
  );
};
export default Login;
