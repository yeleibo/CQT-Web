//包含两个/的才会开启多标签页

export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './user/login' }],
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
    path: '/map',
    name: '资源管理',
    icon: 'icon-xiangmu',
    routes: [
      { path: '/map', redirect: '/map/page' },
      { path: '/map/page', name: '资源地图', component: '@/pages/map/maps' },
    ],
  },
  {
    path: '/organize-manage',
    name: '组织管理',
    icon: 'icon-chengyuanguanli',
    routes: [
      { path: '/organize-manage', redirect: '/organize-manage/organize' },
      {
        path: '/organize-manage/organize',
        name: '组织管理',
        component: '@/pages/organize-manage/organize/OrganizeListPage',
      },
      {
        path: '/organize-manage/user',
        name: '用户管理',
        component: '@/pages/organize-manage/user/UserListPage',
      },
      {
        path: '/organize-manage/role',
        name: '角色管理',
        component: '@/pages/organize-manage/role/RoleListPage',
      },
    ],
  },
];
