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

export const getMenus = function (initialState: any): MenuDataItem[] {
  let currentUser = initialState.currentUser;


  let menus: MenuDataItem[] = [
    {
      path:'/create-code',
      name:'生成编码',
      icon:'icon-xiangmu',
      children:[
        {
          path: '/create-code/boxCode',
          name: 'BoxCodes'
        }
      ]
    },
    {
      path: '/map',
      name: '资源管理',
      icon: 'icon-xiangmu',
      children: [
        { path: '/map', redirect: '/map/page' },
        { path: '/map/page', name: '地图' },
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
        name: '组织管理',
        icon: 'icon-chengyuanguanli',
        children: [
          { path: '/organize-manage', redirect: '/organize-manage/organize' },
          { path: '/organize-manage/organize', name: '组织管理' },
          { path: '/organize-manage/user', name: '用户管理' },
          { path: '/organize-manage/role', name: '角色管理' },
        ],
      },
    ];
    menus.push(...adminMenu);
  }
  return menus;
};
