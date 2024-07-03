import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: '综合GIS资源管理',
  pwa: false,
  logo: '/logo.png',
  //使用自定义图标时需要加入的
  iconfontUrl: '/icons/iconfont.js',
  //设置样式
  token:{
    header: {
      colorBgHeader: '#0E3BA6',
      colorHeaderTitle: '#fff',
      colorTextMenu: '#dfdfdf',
      colorTextMenuSecondary: '#dfdfdf',
      colorTextMenuSelected: '#fff',
      colorBgMenuItemSelected: '#1381FF',
      colorTextMenuActive: '#FFFFFFD9',
      colorTextRightActionsItem: '#dfdfdf',
    },
    colorTextAppListIconHover: '#fff',
    colorTextAppListIcon: '#dfdfdf',
    sider: {
      colorMenuBackground: '#FFFFFF00',
      colorMenuItemDivider: '#FFFFFF00',
      colorBgMenuItemHover: '#FFFFFF00',
      colorTextMenu: '#fff',
      colorTextMenuSelected: '#fff',
      colorTextMenuActive: '#fff',
      colorBgMenuItemSelected:"#00EDFF56"
    },
  },
  // siderMenuType: "sub",
  splitMenus: true,

  footerRender: false
};

export default Settings;
