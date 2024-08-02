import { useIntl } from '@@/plugin-locale';
import type { MenuDataItem } from '@ant-design/pro-layout/es/typing';
import { useModel } from '@umijs/max';

const useInitialState = () => {
  return useModel('@@initialState');
};

export default useInitialState;

// type XDMenuDataItem = MenuDataItem & {
//   permissionCodes?: string[];
//   children?: XDMenuDataItem[];
// };

// const menuCheckPermission = function (
//   menus: XDMenuDataItem[],
//   permissions: string[],
// ): XDMenuDataItem[] {
//   return menus.filter((menu) => {
//     // Check if the menu has any permissions that match the given permissions
//     const hasPermission =
//       menu.permissionCodes === null
//         ? true
//         : menu.permissionCodes!.some((p) => permissions.includes(p));
//
//     // If menu has children, recursively check them as well
//     if (menu.children) {
//       menu.children = menuCheckPermission(menu.children, permissions);
//     }
//
//     // Return true if the menu itself has permission or any of its children have permission
//     return hasPermission;
//   });
// };

// @ts-ignore
export const getMenus = function (initialState: any): MenuDataItem[] {
  let currentUser = initialState.currentUser;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const intl = useIntl();

  let menus: MenuDataItem[] = [
    {
      path: '/create-code',
      name: intl.formatMessage({ id: 'createCode' }),
      icon: 'icon-xiangmu',
      children: [
        {
          path: '/create-code/boxCode',
          name: 'BoxCodes',
        },
        {
          path: '/create-code/cascadeCode',
          name: 'CascadeCableCodes',
        },
        {
          path: '/create-code/dropCode',
          name: 'DropCableCodes',
        },
      ],
    },
    {
      path: '/project',
      name: intl.formatMessage({ id: 'project' }),
      icon: 'icon-xiangmu',
      children: [
        {
          path: '/project/area',
          name: intl.formatMessage({ id: 'zoneConfiguration' }),
        },
        {
          path: '/project/boxStatistics',
          name: intl.formatMessage({ id: 'boxStatistics' }),
        },
      ],
    },
    {
      path: '/map',
      name: intl.formatMessage({ id: 'resourceMap' }),
      icon: 'icon-xiangmu',
      children: [
        { path: '/map', redirect: '/map/page' },
        { path: '/map/page', name: '地图' },
        { path: '/map/area-draw', name: '区域管理' },
      ],
    },
    {
      path: '/topology',
      name: '拓扑图',
      icon: 'icon-xiangmu',
      children: [{ path: '/topology/topo', name: '地图' }],
    },
  ];

  if (currentUser.user.account === 'admin') {
    let adminMenu: MenuDataItem[] = [
      {
        path: '/organize-manage',
        name: intl.formatMessage({ id: 'systemSetting' }),
        icon: 'icon-chengyuanguanli',
        children: [
          { path: '/organize-manage', redirect: '/organize-manage/organize' },
          { path: '/organize-manage/organize', name: intl.formatMessage({ id: 'organizeManage' }) },
          { path: '/organize-manage/user', name: intl.formatMessage({ id: 'userManagement' }) },
          { path: '/organize-manage/role', name: intl.formatMessage({ id: 'roleManagement' }) },
        ],
      },
    ];
    menus.push(...adminMenu);
  }
  return menus;
};
