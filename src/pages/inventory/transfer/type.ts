import {PageParams} from "@/models/page";
import {CellValue} from "@/components/ExcelButton/ExportButton";
import {toStringOfDay} from "@/components/Extension/DateTime";

export type InventoryTransferListDto = {
  code?: string;

  // 录入者姓名
  createByName?: string;

  // 录入时间
  createTime?: Date;

  // 录入部门名称
  organizeName?: string;

  status: InventoryTransferStatus;

  // 仓库
  inventoryOutHouseName?: string;
  inventoryOutAddress?: string;
  inventoryInAddress?: string;

  inventoryInHouseName?: string;

  // 工作流定义的名称
  workflowDefinitionName?: string;

  executedTime?: Date;

  // 处理人姓名
  todoHandleUsersName?: string;

  inventoryInEngineeringName?: string;
  inventoryOutEngineeringName?: string;

  // 工作流实例状态
  workflowInstanceStatus?: string;
  workflowInstanceId?: string;

  // 执行人
  executedUserName?: string;

  remark?: string;

  id: number;
}

export enum InventoryTransferMethod {
  // 调入主库
  secondaryToMain = 0,

  // 调出主库
  mainToSecondary = 1,

  // 乡镇调
  secondaryToSecondary = 2
}

// 辅助函数来替代 Dart 中的 toString 方法
export function getInventoryTransferMethodDescription(method: InventoryTransferMethod): string {
  switch (method) {
    case InventoryTransferMethod.secondaryToMain:
      return "调入主库";
    case InventoryTransferMethod.mainToSecondary:
      return "调出主库";
    case InventoryTransferMethod.secondaryToSecondary:
      return "分公司站点移库";
    default:
      return '';
  }
}

export type InventoryTransferQueryParam = PageParams & {
  inventoryTransferMethod: InventoryTransferMethod;

  startCrateTime?: Date;
  endCreateTime?: Date;
  organizeIds?: number[];

  // 仓库id
  inventoryInHouseIds?: number[];
  inventoryOutHouseIds?: number[];

  isFinished?: boolean;

  // 完成起始时间
  startFinishedTime?: Date;
  // 完成终止时间
  endFinishedTime?: Date;

  // 执行起始时间
  startExecutedTime?: Date;
  // 执行终止时间
  endExecutedTime?: Date;

  keyword?: string;
  status?: InventoryTransferStatus[];
  excludedStatus?: InventoryTransferStatus[];
}

export enum InventoryTransferStatus {
  // 未审核
  unAudited = 0,
  // 审核中
  auditing = 1,
  // 待执行
  unExecuted = 2,
  // 执行中
  executing = 3,
  // 已完成
  executed = 4,
  // 被退回
  rollBack = 5,
  // 已报废
  scrap = 6
}

export function getStatusColor(status: InventoryTransferStatus,isText:boolean): string {
  switch (status) {
    case InventoryTransferStatus.unAudited:
      return isText ? '#9E9E9EFF' : '#9E9E9E14'; // 灰色
    case InventoryTransferStatus.auditing:
      return isText ? '#2196F3FF' : '#2196F314'; // 蓝色
    case InventoryTransferStatus.unExecuted:
      return isText ? '#FF9800FF' : '#FF980014'; // 白色
    case InventoryTransferStatus.executing:
      return isText ? '#E040FBFF' : '#E040FB14'; // 紫色
    case InventoryTransferStatus.executed:
      return isText ? '#4CAF50FF' : '#4CAF5014'; // 绿色
    case InventoryTransferStatus.rollBack:
      return isText ? '#F44336FF' : '#F4433614'; // 红色
    case InventoryTransferStatus.scrap:
      return isText ? '#F44336FF' : '#F4433614'; // 红色
    default:
      return isText ? '#FFFFFFFF' : '#FFFFFF14'; // 白色
  }
}

export function getStatusLabel(status: InventoryTransferStatus): string {
  switch (status) {
    case InventoryTransferStatus.unAudited:
      return "未审核";
    case InventoryTransferStatus.auditing:
      return "审核中";
    case InventoryTransferStatus.unExecuted:
      return "待执行";
    case InventoryTransferStatus.executing:
      return "执行中";
    case InventoryTransferStatus.executed:
      return "已完成";
    case InventoryTransferStatus.rollBack:
      return "被退回";
    case InventoryTransferStatus.scrap:
      return "已报废";
    default:
      return "";
  }
}

export type InventoryTransferGoodDetail = {
  id: number;
  goodId: number;
  goodCode: string;
  goodName: string;

  /// <summary>单位</summary>
  unitName: string;

  /// <summary>单位</summary>
  unitPrice?: number;

  /// 已调拨的数量
  transferredAmount?: number;

  /// <summary>数量</summary>
  amount: number;

  /// <summary>出库仓库物品数量</summary>
  inventoryOutHouseInventoryAmount: number;

  /// <summary>入库仓库物品数量</summary>
  inventoryOutHouseInventoryAvailableAmount: number;

  /// <summary>调入库仓库物品数量</summary>
  inventoryInHouseInventoryAmount: number;

  /// <summary>调入库仓库物品数量</summary>
  inventoryInHouseInventoryAvailableAmount: number;

  /// <summary>工程预算数量</summary>
  engineeringBudgetAmount: number;

  /// <summary>工程物资库存数量</summary>
  inventoryInEngineeringInventoryAmount: number;

  /// <summary>工程剩余库存可用数量</summary>
  inventoryInEngineeringInventoryAvailableAmount: number;

  /// <summary>调出工程物资库存数量</summary>
  inventoryOutEngineeringInventoryAmount: number;

  /// <summary>调出工程剩余库存可用数量</summary>
  inventoryOutEngineeringInventoryAvailableAmount: number;

  /// <summary>已执行的数量</summary>
  executedAmount: number;

  toExecuteAmount: number;

  modifyTime?: Date;

  /// 可用回退的数量
  availableRollbackAmount: number;

  /// <summary>备注</summary>
  remark?: string;

  initAmount?: number;
}

export type InventoryTransferGoodExcelDetail = {
  inventoryTransferCode: string;
  createTime: Date;
  createByName: string;
  inventoryInHouseName: string;
  inventoryOutHouseName: string;
  organizeName: string;
  id?: number;
  goodId: number;
  goodCode: string;
  goodName: string;
  unitName: string;
  executedAmount: number;
  amount: number;
  remark?: string;
}

export const transferHeaders: { [key: string]: CellValue<InventoryTransferListDto> } = {
  '单据号': (item) => item.code ?? '',
  '录入部门': (item) => item.organizeName ?? '',
  '录入人': (item) => item.createByName ?? '',
  '录入时间': (item) => item.createTime ? toStringOfDay(item.createTime) : '',
  '待处理状态': (item) => item.workflowInstanceStatus ?? '',
  '待办人': (item) => item.todoHandleUsersName ?? '',
  '流程名称': (item) => item.workflowDefinitionName ?? '',
  '入库仓库': (item) => item.inventoryInHouseName ?? '',
  '出库仓库': (item) => item.inventoryOutHouseName ?? '',
  '执行人': (item) => item.executedUserName ?? '',
  '执行时间': (item) => item.executedTime ? toStringOfDay(item.executedTime) : '',
  '备注': (item) => item.remark ?? ''
};

export const transferGoodHeader: { [key: string]: CellValue<InventoryTransferGoodExcelDetail> } = {

    '单据号': (item) => item.inventoryTransferCode,
    '录入部门': (item) => item.organizeName,
    '录入人': (item) => item.createByName,
    '录入时间': (item) => toStringOfDay(item.createTime),
    '入库仓库': (item) => item.inventoryInHouseName,
    '出库仓库': (item) => item.inventoryOutHouseName,
    '物资编码': (item) => item.goodCode,
    '物资名称': (item) => item.goodName,
    '单位': (item) => item.unitName,
    '移库数': (item) => item.amount.toString(),
    '已执行数': (item) => item.executedAmount.toString(),
    '备注': (item) => item.remark ?? ''

};
