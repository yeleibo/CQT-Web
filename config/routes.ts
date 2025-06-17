//包含两个/的才会开启多标签页

export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './user/login' }],
  },
  {
    path: '/home',
    name: '首页',
    layout: 'top',
    routes: [
      {
        name: '首页',
        path: '/home/index',
        component: '@/pages/home/index',
      },
      {
        name: '告警信息',
        path: '/home/OpticalCableMonitoringWaringPage',
        component: '@/pages/home/OpticalCableMonitoring/OpticalCableMonitoringWaringPage',
      },
    ],
  },
  {
    path: '/tenant',
    name: '客户设置',
    routes: [
      {
        path: '/tenant/tenantList',
        title: 'operatorManagement',
        component: '@/pages/tenant/TenantListPage',
      },
    ],
  },
  {
    path: '/create-code',
    name: 'createCode',
    routes: [
      {
        path: '/create-code/boxCode',
        name: 'BoxCodes',
        component: '@/pages/create-code/BoxCodeCreatePage',
      },
      {
        path: '/create-code/cascadeCode',
        name: 'CascadeCableCodes',
        component: '@/pages/create-code/CascadeCodePage',
      },
      {
        path: '/create-code/dropCode',
        name: 'DropCableCodes',
        component: '@/pages/create-code/DropCablePage',
      },
      {
        path: '/create-code/codeOrder',
        name: 'CodeOrder',
        component: '@/pages/create-code/CodeOrderListPage',
      },
    ],
  },
  {
    path: '/project',
    name: 'Project',
    routes: [
      {
        path: '/project/area',
        title: 'zoneConfiguration',
        component: '@/pages/project/ZoneConfigurationPage',
      },
      {
        path: '/project/boxStatistics',
        title: 'boxStatistics',
        component: '@/pages/project/BoxStatisticsPage',
      },
    ],
  },
  {
    path: '/topology',
    name: '拓扑图',
    routes: [
      {
        name: '地图',
        path: '/topology/topo',
        component: '@/pages/topology/TopologyPage',
      },
    ],
  },
  {
    path: '/area',
    name: '区域管理',
    routes: [
      { path: '/area/area-draw', name: '区域管理', component: '@/pages/area/DeviceDetail' },
    ],
  },
  {
    path: '/map',
    name: '资源管理',
    icon: 'icon-xiangmu',
    routes: [
      { path: '/map', redirect: '/map/page' },
      { path: '/map/page', name: '资源地图', component: '@/pages/map/maps' },
      {
        path: '/map/area-draw',
        name: '区域管理',
        component: '@/pages/map/area-draw/AreaDrawPage',
      },
    ],
  },
  {
    path: '/organize-manage',
    name: '组织管理',
    icon: 'icon-chengyuanguanli',
    routes: [
      { path: '/organize-manage', redirect: '/organize-manage/organize' },
      {
        title: 'organizeManage',
        path: '/organize-manage/organize',
        component: '@/pages/organize-manage/organize/OrganizeListPage',
      },
      {
        path: '/organize-manage/user',
        title: 'userManagement',
        component: '@/pages/organize-manage/user/UserListPage',
      },
      {
        path: '/organize-manage/role',
        title: 'roleManagement',
        component: '@/pages/organize-manage/role/RoleListPage',
      },
    ],
  },
  { path: '/', redirect: '/home/index' },
  { path: '*', layout: false, component: './404' },
];
