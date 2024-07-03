import { CellValue } from '@/components/ExcelButton/ExportButton';
import { toStringOfDay } from '@/components/Extension/DateTime';
import { PageParams } from '@/models/page';

export type InventoryEngineeringTransferListDto = {
  // 编码
  code?: string;

  // 录入者姓名
  createByName?: string;

  // 录入时间
  createTime?: Date;

  // 执行时间
  executedTime?: Date;

  // 录入部门名称
  organizeName?: string;

  // 采购仓库
  inventoryHouseName?: string;

  // 工作流定义的名称
  workflowDefinitionName?: string;

  // 工作流实例ID
  workflowInstanceId?: string;

  // 调出工程
  inventoryOutEngineeringName: string;

  // 调入工程
  inventoryInEngineeringName?: string;

  // 处理人姓名
  todoHandleUsersName?: string;

  // 工作流实例状态
  status: InventoryEngineeringTransferStatus;

  // 工作流实例状态描述
  workflowInstanceStatus?: string;

  // 备注
  remark?: string;

  // 执行人姓名
  executedUserName?: string;

  id: number;
};

export type InventoryEngineeringTransfersQueryParam = PageParams & {
  // 关键字
  keyword?: string;

  // 申请起始时间
  startCrateTime?: Date;

  // 申请终止时间
  endCreateTime?: Date;

  // 部门ID
  organizeIds?: number[];

  // 调入工程
  inventoryInEngineeringId?: number;

  // 调出工程
  inventoryOutEngineeringId?: number;

  // 相关仓库
  inventoryHouseIds?: number[];

  // 完成起始时间
  startFinishedTime?: Date;

  // 完成终止时间
  endFinishedTime?: Date;

  // 执行起始时间
  startExecutedTime?: Date;

  // 执行终止时间
  endExecutedTime?: Date;

  // 状态
  status?: InventoryEngineeringTransferStatus[];

  // 排除的状态
  excludedStatus?: InventoryEngineeringTransferStatus[];
};

export enum InventoryEngineeringTransferStatus {
  unAudited = 0, // 未审核
  auditing = 1, // 审核中
  unExecuted = 2, // 待执行
  executing = 3, // 执行中
  executed = 4, // 已完成
  rollBack = 5, // 被退回
}

export function getInventoryEngineeringTransferStatusDescription(
  status: InventoryEngineeringTransferStatus,
): string {
  switch (status) {
    case InventoryEngineeringTransferStatus.unAudited:
      return '未审核';
    case InventoryEngineeringTransferStatus.auditing:
      return '审核中';
    case InventoryEngineeringTransferStatus.unExecuted:
      return '待执行';
    case InventoryEngineeringTransferStatus.executing:
      return '执行中';
    case InventoryEngineeringTransferStatus.executed:
      return '已完成';
    case InventoryEngineeringTransferStatus.rollBack:
      return '被退回';
    default:
      return '';
  }
}

export function getInventoryEngineeringTransferStatusColor(
  status: InventoryEngineeringTransferStatus,
  isText: boolean,
): string {
  switch (status) {
    case InventoryEngineeringTransferStatus.unAudited:
      return isText ? '#9E9E9EFF' : '#9E9E9E14'; // 灰色
    case InventoryEngineeringTransferStatus.auditing:
      return isText ? '#2196F3FF' : '#2196F314'; // 蓝色
    case InventoryEngineeringTransferStatus.unExecuted:
      return isText ? '#FF9800FF' : '#FF980014'; // 白色
    case InventoryEngineeringTransferStatus.executing:
      return isText ? '#E040FBFF' : '#E040FB14'; // 紫色
    case InventoryEngineeringTransferStatus.executed:
      return isText ? '#4CAF50FF' : '#4CAF5014'; // 绿色
    case InventoryEngineeringTransferStatus.rollBack:
      return isText ? '#F44336FF' : '#F4433614'; // 红色
    default:
      return isText ? '#FFFFFFFF' : '#FFFFFF14'; // 白色
  }
}

export type InventoryEngineeringTransferGoodDetail = {
  id: number;
  goodId: number;
  goodCode: string;
  goodName: string;
  unitName: string;
  amount: number;
  initAmount?: number;
  inventoryOutEngineeringInventoryAvailableAmount: number;
  executedAmount: number;
  toExecuteAmount: number;
  modifyTime?: Date;
  remark?: string;
};

export type InventoryEngineeringTransferGoodExcelDetail = {
  inventoryEngineeringTransferCode?: string;
  createTime: Date;
  createByName: string;
  inventoryHouseName: string;
  organizeName: string;
  goodId: number;
  goodCode: string;
  goodName: string;
  unitName: string;
  amount: number;
  executedAmount: number;
  remark?: string;
};

export const engineeringTransferHeaders: {
  [key: string]: CellValue<InventoryEngineeringTransferListDto>;
} = {
  单据号: (item) => item.code ?? '',
  录入部门: (item) => item.organizeName ?? '',
  录入人: (item) => item.createByName ?? '',
  录入时间: (item) => (item.createTime ? toStringOfDay(item.createTime) : ''),
  涉及仓库: (item) => item.inventoryHouseName ?? '',
  流程名称: (item) => item.workflowDefinitionName ?? '',
  待处理状态: (item) => item.workflowInstanceStatus ?? '',
  调出工程: (item) => item.inventoryOutEngineeringName,
  调入工程: (item) => item.inventoryInEngineeringName ?? '',
  待办人: (item) => item.todoHandleUsersName ?? '',
  执行人: (item) => item.executedUserName ?? '',
  执行时间: (item) => (item.executedTime ? toStringOfDay(item.executedTime) : ''),
  备注: (item) => item.remark ?? '',
};

export const engineeringTransferGoodHeader: {
  [key: string]: CellValue<InventoryEngineeringTransferGoodExcelDetail>;
} = {
  单据号: (item) => item.inventoryEngineeringTransferCode ?? '',
  录入部门: (item) => item.organizeName,
  录入人: (item) => item.createByName,
  录入时间: (item) => toStringOfDay(item.createTime),
  仓库: (item) => item.inventoryHouseName,
  物资编码: (item) => item.goodCode,
  物资名称: (item) => item.goodName,
  单位: (item) => item.unitName,
  调剂数: (item) => item.amount.toString(),
  已执行数: (item) => item.executedAmount.toString(),
  备注: (item) => item.remark ?? '',
};
