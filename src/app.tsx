import { AvatarDropdown, AvatarName, Question } from '@/components';
import { getMenus } from '@/models/menu';
import Service from '@/pages/user/login/service';
import Token from '@/utils/token';
import { RequestConfig, RequestOptions } from '@@/plugin-request/request';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import { history, Link, RunTimeLayoutConfig, SelectLang } from '@umijs/max';
import { Image, message } from 'antd';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import defaultSettings from '../config/defaultSettings';
import userDefaultAvatar from './assets/images/user_default_avatar.png';
import SystemService from '@/pages/system/service';
import { UserInfo } from '@/pages/user/login/user';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

interface ApplicationConfig {
  applicationName: string;
  longitude: number;
  latitude: number;
  mapViewHeight: number;
}

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: UserInfo;
  loading?: boolean;
  applicationConfig?: ApplicationConfig;
  fetchUserInfo?: () => Promise<UserInfo | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await Service.me();
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const loadConfig = async () => {
    {
      try {
        const response = await SystemService.configs();

        // 验证并转换数据
        const validatedConfig: ApplicationConfig = {
          applicationName: response['ApplicationName'] || '综合资源管理平台',
          longitude: Number(response['MapDefaultLongitude']) || 114.2933,
          latitude: Number(response['MapDefaultLatitude']) || 30.5471,
          mapViewHeight: Number(response['MapDefaultViewHeight']) || 180000,
        };
        return validatedConfig;
      } catch (e) {
        console.error(`错误${e}`);
      }
      return undefined;
    }
  };
  const config = await loadConfig();

  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      applicationConfig: config,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    applicationConfig: config,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    // 动态设置 title
    title: initialState?.applicationConfig?.applicationName || 'Network Management System',
    // rootContainer:(container:any)=>React.createElement(ConfigProvider, null, container),
    //用户旁边的操作设置
    actionsRender: () => (isDev ? [<Question key="doc" />, <SelectLang key="SelectLang" />] : []),
    avatarProps: {
      src: <Image src={userDefaultAvatar} alt="头像"></Image>,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown menu={true}>{avatarChildren}</AvatarDropdown>;
      },
    },
    // 修改 menu 配置
    menu: {
      params: { userId: initialState?.currentUser?.user.id },
      request: async () => {
        return initialState?.currentUser?.menus ?? [];
      },
    },
    //页面改变
    onPageChange: () => {
      const { location } = history;
      // 解析查询字符串
      const searchParams = new URLSearchParams(location.search);
      const userToken = searchParams.get('token'); // 'yourParam' 是你想要的查询参数
      // 如果没有登录，并且路由参数里没有token，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath && userToken === null) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  // 错误接收及处理
  errorConfig: {
    errorHandler: (error: any) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('网络请求出现错误:', { error });
      }
      const { response } = error;
      if (response.status === 401) {
        history.push('/user/login');
        return {};
      }
      let errorMessage = '网络请求异常';
      if (response.data.detail) {
        errorMessage = response.data.detail;
      }
      message.error({
        content: errorMessage,
      });
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      const token = Token.get();
      if (
        !(
          config?.url?.includes('login') ||
          config?.url?.includes('alarms') ||
          config?.url?.includes('80')
        )
      ) {
        // 比如请求头添加token
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: token,
            'Content-Type': 'application/json',
          };
        }
      }
      // // 创建一个新的变量来存储修改后的地址
      // let url:string;
      // url = API_URL + config?.url;
      // // 在这里打印请求数据
      if (process.env.NODE_ENV === 'development ') {
        console.log('发起请求:', { config });
      }
      // 拦截请求配置，进行个性化处理。
      return { ...config };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理

      //开发环境打印请求响应日志
      if (process.env.NODE_ENV === 'development') {
        console.log('网络响应:', { response });
      }
      // 在响应返回之后做些什么
      return response;
    },
  ],
};
