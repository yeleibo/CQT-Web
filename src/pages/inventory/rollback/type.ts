import { CellValue } from '@/components/ExcelButton/ExportButton';
import { toStringOfDay } from '@/components/Extension/DateTime';
import { PageParams } from '@/models/page';

export type InventoryRollbackListDto = {
  // 录入者姓名
  createByName?: string;

  code?: string;

  // 录入时间
  createTime?: Date;

  // 录入部门名称
  organizeName?: string;

  // 仓库
  inventoryHouseName?: string;

  engineeringName?: string;

  // 工作流定义的名称
  workflowDefinitionName?: string;

  workflowInstanceId?: string;

  // 处理人姓名
  todoHandleUsersName?: string;

  status: InventoryRollbackStatus;

  // 工作流实例状态
  workflowInstanceStatus?: string;

  remark?: string;
  executedUserName?: string;

  executedTime?: Date;
  id: number;
};

export type InventoryRollbackQueryParam = PageParams & {
  inventoryRollbackMethod: InventoryRollbackMethod;

  startCrateTime?: Date;
  endCreateTime?: Date;
  organizeIds?: number[];

  // 仓库ID
  inventoryHouseId?: number;

  // 流程状态是否完成
  isFinished?: boolean;

  // 完成起始时间
  startFinishedTime?: Date;

  // 状态列表
  status?: InventoryRollbackStatus[];

  // 排除状态列表
  excludedStatus?: InventoryRollbackStatus[];

  // 完成终止时间
  endFinishedTime?: Date;

  // 关键词
  keyword?: string;

  // 执行起始时间
  startExecutedTime?: Date;

  // 执行终止时间
  endExecutedTime?: Date;
};

export enum InventoryRollbackMethod {
  inventoryInMainRollback = 0, // 正常出库方式
  inventoryTransferMainToSecondaryRollback = 1, // 调出主库回退
  inventoryOutNormal = 2, // 出库回退
}

export function getInventoryRollbackMethodDescription(method: InventoryRollbackMethod): string {
  switch (method) {
    case InventoryRollbackMethod.inventoryInMainRollback:
      return '新入库回退';
    case InventoryRollbackMethod.inventoryTransferMainToSecondaryRollback:
      return '调出主库回退';
    case InventoryRollbackMethod.inventoryOutNormal:
      return '出库回退';
    default:
      return '';
  }
}

export enum InventoryRollbackStatus {
  unAudited = 0, // 未审核
  auditing = 1, // 审核中
  unExecuted = 2, // 待执行
  executing = 3, // 执行中
  executed = 4, // 已完成
  rollBack = 5, // 被退回
}

export function getInventoryRollbackStatusDescription(status: InventoryRollbackStatus): string {
  switch (status) {
    case InventoryRollbackStatus.unAudited:
      return '未审核';
    case InventoryRollbackStatus.auditing:
      return '审核中';
    case InventoryRollbackStatus.unExecuted:
      return '待执行';
    case InventoryRollbackStatus.executing:
      return '执行中';
    case InventoryRollbackStatus.executed:
      return '已完成';
    case InventoryRollbackStatus.rollBack:
      return '被退回';
    default:
      return '';
  }
}

export function getInventoryRollbackStatusColor(
  status: InventoryRollbackStatus,
  isText: boolean,
): string {
  switch (status) {
    case InventoryRollbackStatus.unAudited:
      return isText ? '#9E9E9EFF' : '#9E9E9E14'; // 灰色
    case InventoryRollbackStatus.auditing:
      return isText ? '#2196F3FF' : '#2196F314'; // 蓝色
    case InventoryRollbackStatus.unExecuted:
      return isText ? '#FF9800FF' : '#FF980014'; // 白色
    case InventoryRollbackStatus.executing:
      return isText ? '#E040FBFF' : '#E040FB14'; // 紫色
    case InventoryRollbackStatus.executed:
      return isText ? '#4CAF50FF' : '#4CAF5014'; // 绿色
    case InventoryRollbackStatus.rollBack:
      return isText ? '#F44336FF' : '#F4433614'; // 红色
    default:
      return isText ? '#FFFFFFFF' : '#FFFFFF14'; // 白色
  }
}

export type InventoryRollbackGoodDetail = {
  id: number;
  goodId: number;
  goodCode: string;
  goodName: string;
  unitName?: string;
  amount: number;
  initAmount: number;
  availableRollbackAmount?: number;
  executedAmount: number;
  toExecuteAmount: number;
  inventoryAmount?: number;
  unitPriceBeforeTax?: number;
  unitPriceAfterTax?: number;
  modifyTime?: Date;
  remark?: string;
};

export type InventoryRollbackGoodExcelDetail = {
  inventoryRollbackCode: string;
  createTime: Date;
  createByName: string;
  organizeName: string;
  inventoryHouseName: string;
  correlationCode: string;
  id?: number;
  goodId: number;
  goodCode: string;
  goodName: string;
  unitName?: string;
  amount: number;
  executedAmount: number;
  remark?: string;
};

export const rollbackHeaders: { [key: string]: CellValue<InventoryRollbackListDto> } = {
  单据号: (item) => item.code ?? '',
  录入部门: (item) => item.organizeName ?? '',
  录入人: (item) => item.createByName ?? '',
  录入时间: (item) => (item.createTime ? toStringOfDay(item.createTime) : ''),
  待处理状态: (item) => item.workflowInstanceStatus ?? '',
  待办人: (item) => item.todoHandleUsersName ?? '',
  流程名称: (item) => item.workflowDefinitionName ?? '',
  仓库: (item) => item.inventoryHouseName ?? '',
  执行人: (item) => item.executedUserName ?? '',
  执行时间: (item) => (item.executedTime ? toStringOfDay(item.executedTime) : ''),
  备注: (item) => item.remark ?? '',
};

export const rollbackGoodHeader: { [key: string]: CellValue<InventoryRollbackGoodExcelDetail> } = {
  单据号: (item) => item.inventoryRollbackCode,
  关联单据号: (item) => item.correlationCode,
  录入部门: (item) => item.organizeName,
  录入人: (item) => item.createByName,
  录入时间: (item) => toStringOfDay(item.createTime),
  仓库: (item) => item.inventoryHouseName,
  物资编码: (item) => item.goodCode,
  物资名称: (item) => item.goodName,
  单位: (item) => item.unitName ?? '',
  回退数: (item) => item.amount.toString(),
  已执行数: (item) => item.executedAmount.toString(),
  备注: (item) => item.remark ?? '',
};
