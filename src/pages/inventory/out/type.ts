import { CellValue } from '@/components/ExcelButton/ExportButton';
import { toStringOfDay } from '@/components/Extension/DateTime';
import { PageParams } from '@/models/page';

export type InventoryOutListDto = {
  // 录入者姓名
  createByName?: string;

  code?: string;

  // 录入时间
  createTime?: Date;

  // 录入部门名称
  organizeName?: string;

  engineeringName?: string;
  inventoryOutAddress?: string;

  // 领料人
  recipient?: string;

  // 仓库
  inventoryOutHouseName?: string;

  // 工作流定义的名称
  workflowDefinitionName?: string;

  status: InventoryOutStatus;

  // 盘点单id
  inventorySheetId?: number;

  inventorySheetCode?: string;

  // 处理人姓名
  todoHandleUsersName: string;

  workflowInstanceId?: string;

  // 工作流实例状态
  workflowInstanceStatus?: string;

  executedTime?: Date;

  remark?: string;
  executedUserName?: string;

  id: number;
};

export type InventoryOutQueryParam = PageParams & {
  inventoryOutMethod: InventoryOutMethod;

  startCrateTime?: Date;
  endCreateTime?: Date;
  organizeIds?: number[];
  inventoryOutHouseIds?: number[];

  // 流程状态是否完成
  isFinished?: boolean;

  // 完成起始时间
  startFinishedTime?: Date;
  // 完成终止时间
  endFinishedTime?: Date;

  keyword?: string;

  // 执行起始时间
  startExecutedTime?: Date;
  // 执行终止时间
  endExecutedTime?: Date;

  status?: InventoryOutStatus[];
  excludedStatus?: InventoryOutStatus[];
};

export enum InventoryOutMethod {
  normal = 0,
  scrapOut = 1,
  inventorySheet = 2,
  returnGood = 3,
}

export function getInventoryOutMethodDescription(method: InventoryOutMethod): string {
  switch (method) {
    case InventoryOutMethod.normal:
      return '正常出库';
    case InventoryOutMethod.scrapOut:
      return '物资报废';
    case InventoryOutMethod.inventorySheet:
      return '盘点出库';
    case InventoryOutMethod.returnGood:
      return '物资退货';
    default:
      return '';
  }
}

export enum InventoryOutStatus {
  unAudited = 0, // 未审核
  auditing = 1, // 审核中
  unExecuted = 2, // 待执行
  executing = 3, // 执行中
  executed = 4, // 已完成
  rollBack = 5, // 被退回
  scrap = 6, // 已报废
}

export function getInventoryOutStatusDescription(status: InventoryOutStatus): string {
  switch (status) {
    case InventoryOutStatus.unAudited:
      return '未审核';
    case InventoryOutStatus.auditing:
      return '审核中';
    case InventoryOutStatus.unExecuted:
      return '待执行';
    case InventoryOutStatus.executing:
      return '执行中';
    case InventoryOutStatus.executed:
      return '已完成';
    case InventoryOutStatus.rollBack:
      return '被退回';
    case InventoryOutStatus.scrap:
      return '已报废';
    default:
      return '';
  }
}

export function getInventoryOutStatusColor(status: InventoryOutStatus, isText: boolean): string {
  switch (status) {
    case InventoryOutStatus.unAudited:
      return isText ? '#9E9E9EFF' : '#9E9E9E14'; // 灰色
    case InventoryOutStatus.auditing:
      return isText ? '#2196F3FF' : '#2196F314'; // 蓝色
    case InventoryOutStatus.unExecuted:
      return isText ? '#FF9800FF' : '#FF980014'; // 白色
    case InventoryOutStatus.executing:
      return isText ? '#E040FBFF' : '#E040FB14'; // 紫色
    case InventoryOutStatus.executed:
      return isText ? '#4CAF50FF' : '#4CAF5014'; // 绿色
    case InventoryOutStatus.rollBack:
      return isText ? '#F44336FF' : '#F4433614'; // 红色
    case InventoryOutStatus.scrap:
      return isText ? '#F44336FF' : '#F4433614'; // 红色
    default:
      return isText ? '#FFFFFFFF' : '#FFFFFF14'; // 白色
  }
}

export type InventoryOutGoodDetail = {
  id: number;
  goodId: number;
  goodCode: string;
  goodName: string;
  unitName: string;
  unitPrice: number;
  amount: number;
  initAmount?: number;
  rollbackedAmount: number;
  executedAmount: number;
  toExecuteAmount: number;
  inventoryAmount?: number;
  modifyTime?: Date;
  inventoryAvailableAmount?: number;
  remark?: string;
};

export type InventoryOutGoodExcelDetail = {
  inventoryOutCode: string;
  createTime: Date;
  createByName: string;
  organizeName: string;
  inventoryOutHouseName: string;
  id?: number;
  goodId: number;
  goodCode: string;
  goodName: string;
  unitName: string;
  amount: number;
  executedAmount: number;
  remark?: string;
  financialAmountAfterTax: number;
  financialAmountBeforeTax: number;
};

export const inventoryOutHeaders: { [key: string]: CellValue<InventoryOutListDto> } = {
  单据号: (item) => item.code ?? '',
  录入部门: (item) => item.organizeName ?? '',
  录入人: (item) => item.createByName ?? '',
  录入时间: (item) => (item.createTime ? toStringOfDay(item.createTime) : ''),
  待处理状态: (item) => item.workflowInstanceStatus ?? '',
  待办人: (item) => item.todoHandleUsersName ?? '',
  流程名称: (item) => item.workflowDefinitionName ?? '',
  出库仓库: (item) => item.inventoryOutHouseName ?? '',
  领料人: (item) => item.recipient ?? '',
  执行人: (item) => item.executedUserName ?? '',
  执行时间: (item) => (item.executedTime ? toStringOfDay(item.executedTime) : ''),
  备注: (item) => item.remark ?? '',
};

export const outGoodHeader: { [key: string]: CellValue<InventoryOutGoodExcelDetail> } = {
  单据号: (item) => item.inventoryOutCode,
  录入部门: (item) => item.organizeName,
  录入人: (item) => item.createByName,
  录入时间: (item) => toStringOfDay(item.createTime),
  出库仓库: (item) => item.inventoryOutHouseName,
  物资编码: (item) => item.goodCode,
  物资名称: (item) => item.goodName,
  单位: (item) => item.unitName,
  出库数: (item) => item.amount.toString(),
  税前金额: (item) => item.financialAmountBeforeTax.toFixed(2),
  税后金额: (item) => item.financialAmountAfterTax.toFixed(2),
  已执行数: (item) => item.executedAmount.toString(),
  备注: (item) => item.remark ?? '',
};
