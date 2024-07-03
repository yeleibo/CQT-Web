import type { MenuDataItem } from '@ant-design/pro-layout/es/typing';
import { useModel } from '@umijs/max';

const useInitialState = () => {
  return useModel('@@initialState');
};

export default useInitialState;

let sampleEngineering = {
  name: '工程管理',
  path: '/engineering',
  icon: 'icon-xiangmu',
  children: [
    {
      name: '工程列表',
      path: '/engineering/all',
    },
  ],
};

let inventoryMenu: XDMenuDataItem = {
  name: '物资管理',
  path: '/inventory',
  icon: 'icon-wuzicangku',
  permissionCodes: ['物资管理'],
  children: [
    {
      name: '物资目录',
      path: '/inventory/goodType',
      permissionCodes: ['物资目录'],
    },
    {
      name: '物类定义',
      path: '/inventory/good',
      permissionCodes: ['物类定义'],
    },
    {
      name: '供应商管理',
      path: '/inventory/supplier',
      permissionCodes: ['供应商管理'],
    },
    {
      name: '仓库管理',
      path: '/inventory/house',
      permissionCodes: ['仓库管理'],
    },
    {
      name: '要货单据',
      path: '/inventory/pre-purchase-request',
      permissionCodes: ['入库单据'],
    },
    {
      name: '采购单据',
      path: '/inventory/purchase-request',
      permissionCodes: ['采购单据'],
    },
    {
      name: '进货单据',
      path: '/inventory/purchase',
      permissionCodes: ['进货单据'],
    },
    {
      name: '物资发票',
      path: '/inventory/invoice',
      permissionCodes: ['物资发票'],
    },
    {
      path: '/inventory/in',
      name: '入库单据',
      permissionCodes: ['入库单据'],
      children: [
        {
          path: '/inventory/in/main',
          name: '新入库单据',
          permissionCodes: ['新入库单据'],
        },
        {
          path: '/inventory/in/notMain',
          name: '分仓库入库单据',
          permissionCodes: ['分公司站点入库'],
        },
        { path: '/inventory/in/sheet', name: '盘点入库', permissionCodes: ['货物盘点单'] },
      ],
    },
    {
      path: '/inventory/transfer',
      name: '移库单据',
      permissionCodes: ['移库单据'],
      children: [
        {
          path: '/inventory/transfer/mainToSecondary',
          name: '调出主仓库',
          permissionCodes: ['调出主仓库'],
        },
        {
          path: '/inventory/transfer/secondaryToMain',
          name: '调入主仓库',
          permissionCodes: ['调入主仓库'],
        },
        {
          path: '/inventory/transfer/secondaryToSecondary',
          name: '分公司站点移库',
          permissionCodes: ['分公司站点移库'],
        },
      ],
    },
    {
      path: '/inventory/out',
      name: '出库单据',
      permissionCodes: ['出库单据'],
      children: [
        {
          path: '/inventory/out/normal',
          name: '正常出库',
          permissionCodes: ['正常出库'],
        },
        {
          path: '/inventory/out/scrapOut',
          name: '物资报废',
          permissionCodes: ['物资报废'],
        },
        { path: '/inventory/out/returnGood', name: '物资退货', permissionCodes: ['物资退货'] },
        {
          path: '/inventory/out/inventorySheet',
          name: '盘点出库',
          permissionCodes: ['货物盘点单'],
        },
      ],
    },
    {
      path: '/inventory/rollback',
      name: '物资回退',
      permissionCodes: ['物资回退'],
      children: [
        {
          path: '/inventory/rollback/inventoryInMainRollback',
          name: '新入库回退',
          permissionCodes: ['新入库回退'],
        },
        {
          path: '/inventory/rollback/inventoryTransferMainToSecondaryRollback',
          name: '调出主仓回退',
          permissionCodes: ['调出主仓回退'],
        },
        {
          path: '/inventory/rollback/inventoryOutNormal',
          name: '正常出库回退',
          permissionCodes: ['正常出库回退'],
        },
      ],
    },
    {
      name: '工程调剂',
      path: '/inventory/engineering-transfer',
      permissionCodes: ['工程调剂'],
    },
    {
      name: '单据执行',
      path: '/inventory/executed',
      permissionCodes: ['单据执行'],
      children: [
        {
          path: '/inventory/executed/mainExecuted',
          name: '新入库执行',
          permissionCodes: ['新入库执行'],
        },
        {
          path: '/inventory/executed/notMainExecuted',
          name: '分公司站点入库执行',
          permissionCodes: ['分公司站点入库执行'],
        },
        {
          path: '/inventory/executed/transferMainToSecondaryExecuted',
          name: '调出主仓库执行',
          permissionCodes: ['调出主仓库执行'],
        },
        {
          path: '/inventory/executed/secondaryToMainExecuted',
          name: '调入主仓库执行',
          permissionCodes: ['调入主仓库执行'],
        },
        {
          path: '/inventory/executed/secondaryToSecondaryExecuted',
          name: '分公司站点移库执行',
          permissionCodes: ['分公司站点移库执行'],
        },
        {
          path: '/inventory/executed/normalOutExecuted',
          name: '正常出库执行',
          permissionCodes: ['正常出库执行'],
        },
        {
          path: '/inventory/executed/scrapOutExecuted',
          name: '物资报废执行',
          permissionCodes: ['物资报废执行'],
        },
        {
          path: '/inventory/executed/returnGoodExecuted',
          name: '物资退货执行',
          permissionCodes: ['物资退货执行'],
        },
        {
          path: '/inventory/executed/inMainRollbackExecuted',
          name: '新入库回退执行',
          permissionCodes: ['新入库回退执行'],
        },
        {
          path: '/inventory/executed/mainToSecondaryRollbackExecuted',
          name: '调出主仓库回退执行',
          permissionCodes: ['调出主仓库回退执行'],
        },
        {
          path: '/inventory/executed/normalOutRollbackExecuted',
          name: '正常出库回退执行',
          permissionCodes: ['正常出库回退执行'],
        },
        {
          path: '/inventory/executed/engineeringTransferExecuted',
          name: '工程调剂执行',
          permissionCodes: ['工程调剂执行'],
        },
      ],
    },
    {
      name: '货物盘点单',
      path: '/inventory/sheet',
      permissionCodes: ['货物盘点单'],
    },
    {
      name: '物资仓库报表',
      path: '/inventory/statistics',
      permissionCodes: ['物资仓库报表'],
      children: [
        {
          path: '/inventory/statistics/InventoryHouseGoodAmountWarnPage',
          name: '报警物资',
          permissionCodes: ['报警物资'],
        },
        {
          path: '/inventory/statistics/GoodBatchAmountStatisticsPage',
          name: '物资批次库存',
          permissionCodes: ['物资批次库存'],
        },
        {
          path: '/inventory/statistics/GoodAmountStatisticsWithInventoryHousePage',
          name: '仓库物资库存',
          permissionCodes: ['仓库物资库存'],
        },
        {
          path: '/inventory/statistics/GoodBatchWithInventoryHouseStatisticsPage',
          name: '仓库物资批次库存',
          permissionCodes: ['仓库物资批次库存'],
        },
        {
          path: '/inventory/statistics/GoodInventoryInStatisticsPage',
          name: '物资入库明细',
          permissionCodes: ['物资入库明细'],
        },
        {
          path: '/inventory/statistics/GoodInventoryOutStatisticsPage',
          name: '物资出库明细',
          permissionCodes: ['物资出库明细'],
        },
        {
          path: '/inventory/statistics/GoodInventoryTransferStatisticsPage',
          name: '物资调拨明细',
          permissionCodes: ['物资调拨明细'],
        },
        {
          path: '/inventory/statistics/EngineeringRemainderGoodsStatisticsPage',
          name: '工程剩余物资',
          permissionCodes: ['工程剩余物资'],
        },
        {
          path: '/inventory/statistics/EngineeringInventoryOutGoodPage',
          name: '工程出库物资',
          permissionCodes: ['工程出库物资'],
        },
        {
          path: '/inventory/statistics/SuggestedPurchaseGoodPage',
          name: '采购建议',
          permissionCodes: ['采购建议'],
        },
      ],
    },
    {
      name: '物资财务报表',
      path: '/inventory/FinanceStatistics',
      permissionCodes: ['物资财务报表'],
      children: [
        {
          path: '/inventory/FinanceStatistics/GoodInventoryFinanceStatisticsPage',
          name: '财务统计',
          permissionCodes: ['财务统计'],
        },
        {
          path: '/inventory/FinanceStatistics/FixedAssetStatisticsPage',
          name: '固定资产统计',
          permissionCodes: ['财务统计'],
        },
      ],
    },
    {
      name: '光缆管理',
      path: '/inventory/optical-fibers',
      permissionCodes: ['光缆管理'],
    },
  ],
};

type XDMenuDataItem = MenuDataItem & {
  permissionCodes?: string[];
  children?: XDMenuDataItem[];
};

const menuCheckPermission = function (
  menus: XDMenuDataItem[],
  permissions: string[],
): XDMenuDataItem[] {
  return menus.filter((menu) => {
    // Check if the menu has any permissions that match the given permissions
    const hasPermission =
      menu.permissionCodes === null
        ? true
        : menu.permissionCodes!.some((p) => permissions.includes(p));

    // If menu has children, recursively check them as well
    if (menu.children) {
      menu.children = menuCheckPermission(menu.children, permissions);
    }

    // Return true if the menu itself has permission or any of its children have permission
    return hasPermission;
  });
};

export const getMenus = function (initialState: any): MenuDataItem[] {
  let currentUser = initialState.currentUser;
  let permissionMenus = menuCheckPermission([inventoryMenu], currentUser.permissionCodes);

  let menus: MenuDataItem[] = [
    {
      path: '/my',
      name: '工作台',
      icon: 'icon-shengpi',
      children: [
        { path: '/my', redirect: '/my/todo' },
        { path: '/my/todo', name: '我的待办' },
        { path: '/my/message', name: '我的消息' },
        { path: '/my/done', name: '已办事宜' },
        { path: '/my/start', name: '我发起的' },
      ],
    },
    sampleEngineering,
    ...permissionMenus,
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
      {
        path: '/system',
        name: '系统设置',
        icon: 'icon-xitongguanli',
        children: [
          { path: '/system', redirect: '/system/dictionary' },
          { path: '/system/dictionary', name: '数据字典' },
          { path: '/system/Workflow', name: '流程管理' },
        ],
      },
      {
        path: '/designable',
        name: '表单设计',
        icon: 'icon-xiangmu',
        children: [
          { path: '/designable', redirect: '/designable/list' },
          { path: '/designable/list', name: '表单设计' },
        ],
      },
    ];
    menus.push(...adminMenu);
  }
  return menus;
};
