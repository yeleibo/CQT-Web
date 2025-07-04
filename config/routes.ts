//包含两个/的才会开启多标签页

export default [
  { path: '/', component: '@/pages/home/HomeRedirectPage' },
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
    ],
  },
  {
    path: '/project',
    name: 'Project',
    routes: [
      { path: '/project', redirect: '/project/index' },
      {
        name: '项目',
        path: '/project/index',
        component: '@/pages/project/ProjectListPage',
      },
      {
        name: '盒子统计',
        path: '/project/boxStatistics',
        title: 'boxStatistics',
        component: '@/pages/project/BoxStatisticsPage',
      },
    ],
  },
  {
    path: '/map',
    name: '资源管理',
    icon: 'icon-xiangmu',
    routes: [
      { path: '/map', redirect: '/map/index' },
      { path: '/map/index', name: '资源地图', component: '@/pages/map/maps' }],
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
  {
    path: '/system',
    name: '系统管理',
    icon: 'icon-chengyuanguanli',
    routes: [
      { path: '/system', redirect: '/system/dictionary' },
      {
        path: '/system/dictionary',
        name: '数据字典',
        component: '@/pages/system/dictionary/DictionaryListPage',
      },
      {
        path: '/system/systemConfig',
        name: '系统配置',
        component: '@/pages/system/commonSystemConfig/CommonSystemConfig',
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
    name: '编码创建',
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
  { path: '*', layout: false, component: './404' },
];
