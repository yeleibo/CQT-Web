import {PageParams} from "@/models/page";
import {CellValue} from "@/components/ExcelButton/ExportButton";
import {toStringOfDay} from "@/components/Extension/DateTime";

export type InventoryPurchaseListDto = {
  code?: string;
  createByName?: string;
  createTime?: Date;
  buyTime?: Date;
  inventoryInHouseId?: number;
  inventoryInHouseName?: string;
  supplierId?: number;
  supplierName?: string;
  organizeId?: number;
  organizeName?: string;
  workflowDefinitionName?: string;
  workflowInstanceId?: string;
  todoHandleUsersName?: string;
  status: InventoryPurchaseStatus;
  workflowInstanceStatus?: string;
  batchNumber?: string;
  remark?: string;
  id: number;
}

export enum InventoryPurchaseStatus {
  unStart = 0,
  auditing = 1,
  finished = 2,
  scraped = 3,
}

export function getStatusLabel(status: InventoryPurchaseStatus): string {
  switch (status) {
    case InventoryPurchaseStatus.unStart:
      return '未开始';
    case InventoryPurchaseStatus.auditing:
      return '进行中';
    case InventoryPurchaseStatus.finished:
      return '已完成';
    case InventoryPurchaseStatus.scraped:
      return '已报废';
    default:
      return '';
  }
}

export function getStatusColor(status: InventoryPurchaseStatus,isText:boolean): string {
  switch (status) {
    case InventoryPurchaseStatus.unStart:
      return isText ? '#9E9E9EFF' : '#9E9E9E14'; // 灰色
    case InventoryPurchaseStatus.auditing:
      return isText ? '#2196F3FF' : '#2196F314'; // 蓝色
    case InventoryPurchaseStatus.finished:
      return isText ? '#4CAF50FF' : '#4CAF5014'; // 绿色
    case InventoryPurchaseStatus.scraped:
      return isText ? '#F44336FF' : '#F4433614'; // 红色
    default:
      return isText ? '#FFFFFFFF' : '#FFFFFF14'; // 白色
  }
}

export type InventoryPurchaseQueryParam = PageParams & {
  keyword?: string;
  startBuyTime?: Date;
  endBuyTime?: Date;
  isCorrelationInventoryIn?: boolean;
  isCorrelationInventoryInvoice?: boolean;
  organizeIds?: number[];
  inventoryHouseId?: number;
  inventoryInHouseIds?: number[];
  status?: FormStatusCommon[];
  excludedStatus?: FormStatusCommon[];
  supplierIds?: number[];
  isMainInventoryHouse?: boolean;
}

export enum FormStatusCommon {
  unStart = 0,
  running = 1,
  finished = 2,
  faulted = 3,
  cancelled = 4,
}

function getFormStatusColor(status: FormStatusCommon): string {
  switch (status) {
    case FormStatusCommon.unStart:
      return 'grey';
    case FormStatusCommon.running:
      return 'blue';
    case FormStatusCommon.finished:
      return 'green';
    case FormStatusCommon.faulted:
      return 'red';
    case FormStatusCommon.cancelled:
      return 'teal';
    default:
      return 'white';
  }
}

function getFormStatusLabel(status: FormStatusCommon): string {
  switch (status) {
    case FormStatusCommon.unStart:
      return '末开始';
    case FormStatusCommon.running:
      return '审核中';
    case FormStatusCommon.finished:
      return '已完成';
    case FormStatusCommon.faulted:
      return '失败';
    case FormStatusCommon.cancelled:
      return '取消';
    default:
      return '';
  }
}

export type InventoryPurchaseGood = {
  id: number;
  inventoryPurchaseCode?: string;
  inventoryPurchaseId?: number;
  goodId: number;
  goodName?: string;
  goodCode?: string;
  unitName?: string;
  unitPriceBeforeTax: number;
  unitPriceAfterTax: number;
  totalPriceBeforeTax: number;
  totalPriceAfterTax: number;
  isZeroPrice: boolean;
  purchasedAmount?: number; // This field seems to be used for internal purposes and not exposed in JSON
  purchaseAmount?: number; // This field seems to be used for internal purposes and not exposed in JSON
  amount: number;
  initAmount?: number;
  batchNumber?: string;
  remark?: string;
}

export type InventoryPurchaseGoodExcelDto = InventoryPurchaseGood & {
  createTime: Date;
  createByName: string;
  organizeName: string;
  inventoryInHouseName: string;
}

export const purchaseHeaders: { [key: string]: CellValue<InventoryPurchaseListDto> } = {
  '进货单据编号': (item) => item.code ?? '',
  '状态': (item) => getStatusLabel(item.status),
  '供应商': (item) => item.supplierName ?? '',
  '录入部门': (item) => item.organizeName ?? '',
  '录入人': (item) => item.createByName ?? '',
  '录入时间': (item) => item.createTime ? toStringOfDay(item.createTime) : '',
  '进货时间': (item) => item.buyTime ? toStringOfDay(item.buyTime) : '',
  '进货仓库': (item) => item.inventoryInHouseName ?? '',
  '流程名称': (item) => item.workflowDefinitionName ?? '',
  '当前步骤': (item) => {
    if (item.workflowInstanceStatus?.length !== 0 && item.todoHandleUsersName?.length !== 0) {
      return `${item.workflowInstanceStatus}(${item.todoHandleUsersName})`;
    }
    return '';
  },
  '备注': (item) => item.remark ?? '',
};

export const purchaseGoodHeaders: { [key: string]: CellValue<InventoryPurchaseGoodExcelDto> } = {
  '进货单据编号': (item) => item.inventoryPurchaseCode ?? '',
  '录入部门': (item) => item.organizeName,
  '录入人': (item) => item.createByName,
  '录入时间': (item) => toStringOfDay(item.createTime),
  '进货仓库': (item) => item.inventoryInHouseName,
  '物资名称': (item) => item.goodName ?? '',
  '物资编码': (item) => item.goodCode ?? '',
  '采购税前价': (item) => item.unitPriceBeforeTax.toString(),
  '采购税后价': (item) => item.unitPriceAfterTax.toString(),
  '单位': (item) => item.unitName ?? '',
  '进货数量': (item) => item.amount.toString(),
  '是否零价': (item) => item.isZeroPrice ? '是' : '否',
  '税前总价': (item) => (item.unitPriceBeforeTax * item.amount).toString(),
  '税后总价': (item) => (item.unitPriceAfterTax * item.amount).toString(),
  '备注': (item) => item.remark ?? ''
};

