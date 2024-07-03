//包含两个/的才会开启多标签页

export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './user/login' }],
  },
  {
    path: '/my',
    name: '工作台',
    icon: 'icon-shengpi',
    routes: [
      { path: '/my', redirect: '/my/todo' },
      { path: '/my/todo', name: '我的待办', component: './Engineering' },
      { path: '/my/message', name: '我的消息', component: './Engineering' },
      { path: '/my/done', name: '已办事宜', component: './Engineering' },
      { path: '/my/start', name: '我发起的', component: './Engineering' },
    ],
  },
  {
    path: '/inventory',
    name: '物资管理',
    icon: 'icon-wuzicangku',
    routes: [
      { path: '/inventory', redirect: '/inventory/goodType' },
      {
        path: '/inventory/goodType',
        name: '物资目录',
        component: '@/pages/inventory/good-type/GoodTypePage',
      },
      { path: '/inventory/good', name: '物类定义', component: '@/pages/inventory/good/GoodPage' },
      {
        path: '/inventory/house',
        name: '仓库管理',
        component: '@/pages/inventory/house/InventoryHousePage',
      },
      {
        path: '/inventory/supplier',
        name: '供应商管理',
        component: '@/pages/inventory/supplier/SupplierListPage',
      },
      {
        path: '/inventory/pre-purchase-request',
        name: '要货单据',
        component: '@/pages/inventory/pre-purchase-request/PrePurchaseRequestListPage',
      },
      {
        path: '/inventory/purchase-request',
        name: '采购单据',
        component: '@/pages/inventory/purchase-request/PurchaseRequestListPage',
      },
      {
        path: '/inventory/purchase',
        name: '进货单据',
        component: '@/pages/inventory/purchase/PurchaseListPage',
      },
      {
        path: '/inventory/invoice',
        name: '物资发票',
        component: '@/pages/inventory/invoice/InvoiceListPage',
      },
      {
        path: '/inventory/in',
        routes: [
          {
            path: '/inventory/in/main',
            name: '新入库单据',
            component: '@/pages/inventory/in/InventoryInListPage',
          },
          {
            path: '/inventory/in/notMain',
            name: '分仓库入库单据',
            component: '@/pages/inventory/in/InventoryInListPage',
          },
          {
            path: '/inventory/in/sheet',
            name: '盘点入库',
            component: '@/pages/inventory/in/InventoryInListPage',
          },
        ],
      },
      {
        path: '/inventory/transfer',
        routes: [
          {
            path: '/inventory/transfer/mainToSecondary',
            name: '调出主仓库',
            component: '@/pages/inventory/transfer/InventoryTransferListPage',
          },
          {
            path: '/inventory/transfer/secondaryToMain',
            name: '调入主仓库',
            component: '@/pages/inventory/transfer/InventoryTransferListPage',
          },
          {
            path: '/inventory/transfer/secondaryToSecondary',
            name: '分公司站点移库',
            component: '@/pages/inventory/transfer/InventoryTransferListPage',
          },
        ],
      },
      {
        path: '/inventory/out',
        routes: [
          {
            path: '/inventory/out/normal',
            name: '正常出库',
            component: '@/pages/inventory/out/InventoryOutListPage',
          },
          {
            path: '/inventory/out/scrapOut',
            name: '物资报废',
            component: '@/pages/inventory/out/InventoryOutListPage',
          },
          {
            path: '/inventory/out/returnGood',
            name: '物资退货',
            component: '@/pages/inventory/out/InventoryOutListPage',
          },
          {
            path: '/inventory/out/inventorySheet',
            name: '盘点出库',
            component: '@/pages/inventory/out/InventoryOutListPage',
          },
        ],
      },
      {
        path: '/inventory/rollback',
        routes: [
          {
            path: '/inventory/rollback/inventoryInMainRollback',
            name: '新入库回退',
            component: '@/pages/inventory/rollback/InventoryRollbackListPage',
          },
          {
            path: '/inventory/rollback/inventoryTransferMainToSecondaryRollback',
            name: '调出主仓回退',
            component: '@/pages/inventory/rollback/InventoryRollbackListPage',
          },
          {
            path: '/inventory/rollback/inventoryOutNormal',
            name: '正常出库回退',
            component: '@/pages/inventory/rollback/InventoryRollbackListPage',
          },
        ],
      },
      {
        path: '/inventory/engineering-transfer',
        name: '工程调剂',
        component: '@/pages/inventory/engineering-transfer/InventoryEngineeringTransferListPage',
      },
      {
        path: '/inventory/executed',
        routes: [
          {
            path: '/inventory/executed/mainExecuted',
            name: '新入库执行',
            component: '@/pages/inventory/executed/InventoryInExecutedPage',
          },
          {
            path: '/inventory/executed/notMainExecuted',
            name: '分公司站点入库执行',
            component: '@/pages/inventory/executed/InventoryInExecutedPage',
          },
          {
            path: '/inventory/executed/transferMainToSecondaryExecuted',
            name: '调出主仓库执行',
            component: '@/pages/inventory/executed/InventoryTransferExecutedPage',
          },
          {
            path: '/inventory/executed/secondaryToMainExecuted',
            name: '调入主仓库执行',
            component: '@/pages/inventory/executed/InventoryTransferExecutedPage',
          },
          {
            path: '/inventory/executed/secondaryToSecondaryExecuted',
            name: '分公司站点移库执行',
            component: '@/pages/inventory/executed/InventoryTransferExecutedPage',
          },
          {
            path: '/inventory/executed/normalOutExecuted',
            name: '正常出库执行',
            component: '@/pages/inventory/executed/InventoryOutExecutedPage',
          },
          {
            path: '/inventory/executed/scrapOutExecuted',
            name: '物资报废执行',
            component: '@/pages/inventory/executed/InventoryOutExecutedPage',
          },
          {
            path: '/inventory/executed/returnGoodExecuted',
            name: '物资退货执行',
            component: '@/pages/inventory/executed/InventoryOutExecutedPage',
          },
          {
            path: '/inventory/executed/inMainRollbackExecuted',
            name: '新入库回退执行',
            component: '@/pages/inventory/executed/InventoryRollbackExecutePage',
          },
          {
            path: '/inventory/executed/mainToSecondaryRollbackExecuted',
            name: '调出主仓库回退执行',
            component: '@/pages/inventory/executed/InventoryRollbackExecutePage',
          },
          {
            path: '/inventory/executed/normalOutRollbackExecuted',
            name: '正常出库回退执行',
            component: '@/pages/inventory/executed/InventoryRollbackExecutePage',
          },
          {
            path: '/inventory/executed/engineeringTransferExecuted',
            name: '工程调剂执行',
            component: '@/pages/inventory/executed/EngineeringTransferExecutePage',
          },
        ],
      },
      {
        path: '/inventory/sheet',
        name: '货物盘点单',
        component: '@/pages/inventory/sheet/InventorySheetListPage',
      },

      {
        path: '/inventory/statistics',
        name: '物资仓库报表',
        routes: [
          {
            path: '/inventory/statistics/InventoryHouseGoodAmountWarnPage',
            name: '报警物资',
            component: '@/pages/inventory/statistics/InventoryHouseGoodAmountWarnPage',
          },
          {
            path: '/inventory/statistics/GoodBatchAmountStatisticsPage',
            name: '物资批次库存',
            component: '@/pages/inventory/statistics/GoodBatchAmountStatisticsPage',
          },
          {
            path: '/inventory/statistics/GoodAmountStatisticsWithInventoryHousePage',
            name: '仓库物资库存',
            component: '@/pages/inventory/statistics/GoodAmountStatisticsWithInventoryHousePage',
          },
          {
            path: '/inventory/statistics/GoodBatchWithInventoryHouseStatisticsPage',
            name: '仓库物资批次库存',
            component: '@/pages/inventory/statistics/GoodBatchWithInventoryHouseStatisticsPage',
          },
          {
            path: '/inventory/statistics/GoodInventoryInStatisticsPage',
            name: '物资入库明细',
            component: '@/pages/inventory/statistics/GoodInventoryInStatisticsPage',
          },
          {
            path: '/inventory/statistics/GoodInventoryOutStatisticsPage',
            name: '物资出库明细',
            component: '@/pages/inventory/statistics/GoodInventoryOutStatisticsPage',
          },
          {
            path: '/inventory/statistics/GoodInventoryTransferStatisticsPage',
            name: '物资调拨明细',
            component: '@/pages/inventory/statistics/GoodInventoryTransferStatisticsPage',
          },
          {
            path: '/inventory/statistics/EngineeringRemainderGoodsStatisticsPage',
            name: '工程剩余物资',
            component: '@/pages/inventory/statistics/EngineeringRemainderGoodsStatisticsPage',
          },
          {
            path: '/inventory/statistics/EngineeringInventoryOutGoodPage',
            name: '工程出库物资',
            component: '@/pages/inventory/statistics/EngineeringInventoryOutGoodPage',
          },
          {
            path: '/inventory/statistics/SuggestedPurchaseGoodPage',
            name: '采购建议',
            component: '@/pages/inventory/statistics/SuggestedPurchaseGoodPage',
          },
        ],
      },
      {
        name: '物资财务报表',
        path: '/inventory/FinanceStatistics',
        routes: [
          {
            path: '/inventory/FinanceStatistics/GoodInventoryFinanceStatisticsPage',
            name: '财务统计',
            component: '@/pages/inventory/statistics/GoodInventoryFinanceStatisticsPage',
          },
          {
            path: '/inventory/FinanceStatistics/FixedAssetStatisticsPage',
            name: '固定资产统计',
            component: '@/pages/inventory/statistics/FixedAssetStatisticsPage',
          },
        ],
      },
      {
        name: '光缆管理',
        path: '/inventory/optical-fibers',
        component: '@/pages/inventory/optical-fibers/OpticalFibersListPage',
      },
    ],
  },
  {
    path: '/engineering',
    name: '工程管理',
    icon: 'icon-xiangmu',
    routes: [
      { path: '/engineering', redirect: '/engineering/all' },
      { path: '/engineering/all', name: '全部工程', component: './Engineering' },
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
  {
    path: '/system',
    name: '系统设置',
    icon: 'icon-xitongguanli',
    routes: [
      { path: '/system', redirect: '/system/dictionary' },
      {
        path: '/system/dictionary',
        name: '数据字典',
        component: '@/pages/system/dictionary/DictionaryListPage',
      },
      {
        path: '/system/Workflow',
        name: '流程管理',
        component: '@/pages/system/workflow/WorkflowDefinitionExtendInfoListPage',
      },
    ],
  },
  {
    path: '/designable',
    name: '表单设计',
    icon: 'icon-xiangmu',
    routes: [
      { path: '/designable', redirect: '/designable/list' },
      {
        path: '/designable/list',
        name: '列表',
        component: '@/pages/Designable/DesignableListPage',
      },
    ],
  },
  { name: '查询表格', icon: 'table', path: '/list', component: './table-list' },
  { path: '/', redirect: '/my/todo' },
  { path: '*', layout: false, component: './404' },
  ///移动端
  {
    path: 'mobile',
    hideInMenu: true,
    routes: [{ path: '/mobile/Engineering', icon: 'smile', component: './Engineering' }],
  },
];
