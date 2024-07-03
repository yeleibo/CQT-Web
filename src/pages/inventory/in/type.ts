import {PageParams} from "@/models/page";
import {CellValue} from "@/components/ExcelButton/ExportButton";
import {toStringOfDay} from "@/components/Extension/DateTime";

export enum InventoryInMethod {
  inMain = 0,
  inSecondary = 1,
  inventorySheet = 2,
}

export function getInventoryInMethodString(method: InventoryInMethod): string {
  switch (method) {
    case InventoryInMethod.inMain:
      return "主仓库";
    case InventoryInMethod.inSecondary:
      return "次仓库";
    case InventoryInMethod.inventorySheet:
      return "盘点入库";
    default:
      return "";
  }
}

export  type InventoryInListDto={
  code?: string;
  createByName?: string;
  inventorySheetId?: number;
  inventorySheetCode?: string;
  createTime?: Date;
  organizeName?: string;
  supplierName?: string;
  inventoryInHouseName?: string;
  inventoryInStorageLocation?: string;
  workflowDefinitionName?: string;
  workflowInstanceId?: string;
  workflowDefinitionId?: string;
  todoHandleUsersName?: string;
  engineeringName?: string;
  executedTime?: Date;
  workflowInstanceStatus?: string;
  executedUserName?: string;
  remark?: string;
  status: InventoryInStatus;
  id: number;
}


export type InventoryInQueryParam=PageParams & {
  keyword?: string;
  inventoryInMethod?: InventoryInMethod;
  startCrateTime?: Date;
  endCreateTime?: Date;
  organizeIds?: number[];
  supplierIds?: number[];
  inventoryInHouseIds?: number[];
  startFinishedTime?: Date;
  endFinishedTime?: Date;
  startExecutedTime?: Date;
  endExecutedTime?: Date;
  status?: InventoryInStatus[];
  excludedStatus?: InventoryInStatus[];
}

export enum InventoryInStatus {
  unAudited = 0,
  auditing = 1,
  unExecuted = 2,
  executing = 3,
  executed = 4,
  rollBack = 5,
  scrap = 6,
}

export function getInventoryInStatusLabel(status: InventoryInStatus): string {
  switch (status) {
    case InventoryInStatus.unAudited:
      return "未审核";
    case InventoryInStatus.auditing:
      return "审核中";
    case InventoryInStatus.unExecuted:
      return "待执行";
    case InventoryInStatus.executing:
      return "执行中";
    case InventoryInStatus.executed:
      return "已完成";
    case InventoryInStatus.rollBack:
      return "被退回";
    case InventoryInStatus.scrap:
      return "已报废";
    default:
      return "";
  }
}

export function getInventoryInStatusColor(status: InventoryInStatus,isText:boolean): string {
  switch (status) {
    case InventoryInStatus.unAudited:
      return isText ? '#9E9E9EFF' : '#9E9E9E14'; // 灰色
    case InventoryInStatus.auditing:
      return isText ? '#2196F3FF' : '#2196F314'; //蓝色
    case InventoryInStatus.unExecuted:
      return isText ? '#FF9800FF' : '#FF980014'; //橘黄色
    case InventoryInStatus.executing:
      return isText ? '#E040FBFF' : '#E040FB14'; // 紫色
    case InventoryInStatus.executed:
      return isText ? '#4CAF50FF' : '#4CAF5014'; // 绿色
    case InventoryInStatus.rollBack:
      return isText ? '#F44336FF' : '#F4433614'; // 红色
    case InventoryInStatus.scrap:
      return isText ? '#F44336FF' : '#F4433614'; // 红色
    default:
      return isText ? '#FFFFFFFF' : '#FFFFFF14'; // 白色
  }
}

export type InventoryInDetailGoodDto = {
  id: number;
  // 商品id
  goodId: number;
  goodName: string;
  goodCode: string;
  unitName?: string;

  // 入库税前单价
  unitPriceBeforeTax: number;

  // 入库税后单价
  unitPriceAfterTax: number;

  // 数量
  amount: number;

  // 税前总价
  totalPriceBeforeTax: number;

  // 税后总价
  totalPriceAfterTax: number;

  initAmount?: number;

  // 已执行数量
  executedAmount: number;

  modifyTime?: Date;

  // 去执行数量
  toExecuteAmount: number;

  // 可回退数量
  availableRollbackAmount: number;

  // 是否零价
  isZeroPrice: boolean;

  // 备注
  remark?: string;
}

export type InventoryInGood = {
  inventoryPurchaseGoodId?: number;
  goodId: number;
  goodName?: string;
  goodCode?: string;
  unitName?: string;
  unitPriceBeforeTax: number;
  unitPriceAfterTax: number;
  amount: number;
  isZeroPrice?: boolean;
  totalPriceBeforeTax?: number;
  totalPriceAfterTax?: number;
  remark?: string;
  id?: number;
  initAmount?: number;
  executedAmount: number;
  modifyTime?: Date;
  toExecuteAmount: number;
  availableRollbackAmount: number;
}

export type InventoryInAddDto = {
  id?: number;

  /// 工作流
  workflowDefinitionId?: string;

  /// 物资录入部门
  organizeId?: number;

  /// 仓库
  inventoryInHouseId?: number;
  inventoryInHouseName?: string;

  /// 供应商id
  supplierId?: number;
  supplierName?: string;

  /// 存放位置
  inventoryInStorageLocation?: string;

  /// 关联工程id
  engineeringId?: number;

  /// 关联工程编号
  engineeringName?: string;

  /// 关联的采购申请id
  inventoryPurchaseId?: number;

  /// code
  inventoryPurchaseCode?: string;

  /// 入库方式
  inventoryInMethod?: InventoryInMethod;

  /// 税前总价
  totalPriceBeforeTax?: number;

  /// 税后总价
  totalPriceAfterTax?: number;

  /// 备注
  remark?: string;

  /// 采购单明细
  goods: InventoryInGood[];
}

export type InventoryInGoodExcelDto = InventoryInGood & {
  inventoryInCode: string;
  createTime: Date;
  createByName: string;
  organizeName: string;
  inventoryInHouseName: string;
}

export const inventoryInHeaders: { [key: string]: CellValue<InventoryInListDto> } = {
  '入库单据编号': (item) => item.code ?? '',
  '状态': (item) => getInventoryInStatusLabel(item.status),
  '供应商': (item) => item.supplierName ?? '',
  '录入部门': (item) => item.organizeName ?? '',
  '录入人': (item) => item.createByName ?? '',
  '录入时间': (item) => item.createTime ? toStringOfDay(item.createTime) : '',
  '入库仓库': (item) => item.inventoryInHouseName ?? '',
  '流程名称': (item) => item.workflowDefinitionName ?? '',
  '当前步骤': (item) => {
    if (item.workflowInstanceStatus?.length !== 0 && item.todoHandleUsersName?.length !== 0) {
      return `${item.workflowInstanceStatus}(${item.todoHandleUsersName})`;
    }
    return '';
  },
  '存放位置': (item) => item.inventoryInStorageLocation ?? '',
  '执行人': (item) => item.executedUserName ?? '',
  '执行时间': (item) => item.executedTime ? toStringOfDay(item.executedTime) : '',
  '备注': (item) => item.remark ?? '',
};

export const inGoodHeaders: { [key: string]: CellValue<InventoryInGoodExcelDto> } = {
  '入库单据编号': (item) => item.inventoryInCode,
  '录入部门': (item) => item.organizeName,
  '录入人': (item) => item.createByName,
  '录入时间': (item) => toStringOfDay(item.createTime),
  '入库仓库': (item) => item.inventoryInHouseName,
  '物资名称': (item) => item.goodName,
  '物资编码': (item) => item.goodCode,
  '税前单价': (item) => item.unitPriceBeforeTax.toString(),
  '税后单价': (item) => item.unitPriceAfterTax.toString(),
  '单位': (item) => item.unitName ?? '',
  '入库数量': (item) => item.amount.toString(),
  '是否零价': (item) => item.isZeroPrice ? '是' : '否',
  '税前总价': (item) => (item.unitPriceBeforeTax * item.amount).toString(),
  '税后总价': (item) => (item.unitPriceAfterTax * item.amount).toString(),
  '已执行数量': (item) => item.executedAmount.toString(),
  '备注': (item) => item.remark ?? ''
};
