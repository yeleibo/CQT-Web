import {PageParams} from "@/models/page";
import {CellValue} from "@/components/ExcelButton/ExportButton";
import {toStringOfDay} from "@/components/Extension/DateTime";

export  type InventoryPurchaseRequestListDto = {
  code?: string;
  createByName?: string;
  inventoryInHouseId?: number;
  supplierId?: number;
  organizeId?: number;
  organizeName?: string;
  inventoryInHouseName?: string;
  workflowDefinitionName?: string;
  workflowInstanceId?: string;
  supplierName?: string;
  todoHandleUsersName?: string;
  status: InventoryPurchaseRequestStatus;
  workflowInstanceStatus?: string;
  remark?: string;
  id: number;
}

export enum InventoryPurchaseRequestStatus {
  unAudited = 0,
  auditing = 1,
  unPurchased = 2,
  purchasing = 3,
  purchased = 4,
  scraped = 5,
}

export function getStatusLabel(status: InventoryPurchaseRequestStatus): string {
  switch (status) {
    case InventoryPurchaseRequestStatus.unAudited:
      return '未审核';
    case InventoryPurchaseRequestStatus.auditing:
      return '审核中';
    case InventoryPurchaseRequestStatus.unPurchased:
      return '未进货';
    case InventoryPurchaseRequestStatus.purchasing:
      return '进货中';
    case InventoryPurchaseRequestStatus.purchased:
      return '进货完成';
    case InventoryPurchaseRequestStatus.scraped:
      return '已报废';
    default:
      return '';
  }
}

export function getStatusColor(status: InventoryPurchaseRequestStatus,isText:boolean): string {
  switch (status) {
    case InventoryPurchaseRequestStatus.unAudited:
      return isText ? '#9E9E9EFF' : '#9E9E9E14'; // 灰色
    case InventoryPurchaseRequestStatus.auditing:
      return isText ? '#2196F3FF' : '#2196F314'; // 蓝色
    case InventoryPurchaseRequestStatus.unPurchased:
      return isText ? '#4CAF50FF' : '#4CAF5014'; // 绿色
    case InventoryPurchaseRequestStatus.purchasing:
      return isText ? '#E040FBFF' : '#E040FB14'; // 紫色
    case InventoryPurchaseRequestStatus.purchased:
      return isText ? '#009688FF' : '#00968814'; // 青色
    case InventoryPurchaseRequestStatus.scraped:
      return isText ? '#F44336FF' : '#F4433614'; // 红色
    default:
      return isText ? '#FFFFFFFF' : '#FFFFFF14'; // 白色
  }
}


export type InventoryPurchaseRequestQueryParam = PageParams & {
  keyword?: string;

  // 录入时间
  startCreateTime?: Date;
  endCreateTime?: Date;

  // 是否已经关联
  isCorrelation?: boolean;

  // 部门id
  organizeIds?: number[];

  // 仓库id
  inventoryInHouseIds?: number[];

  // 供应商id
  supplierIds?: number[];

  // 流程状态
  status?: InventoryPurchaseRequestStatus[];

  // 排除的流程状态
  excludedStatus?: InventoryPurchaseRequestStatus[];
}

export type InventoryPurchaseRequestGood = {
  id?: number;
  goodId: number;
  goodName: string;
  goodCode: string;
  unitName?: string;
  unitPriceBeforeTax: number;
  unitPriceAfterTax: number;
  purchasedAmount: number;
  amount: number;
  totalPriceBeforeTax: number;
  totalPriceAfterTax: number;
  remark?: string;
}

export type InventoryPurchaseRequestGoodExcelDto = InventoryPurchaseRequestGood & {
  inventoryPurchaseRequestCode?: string;
  createTime: Date;
  createByName: string;
  organizeName: string;
  inventoryInHouseName: string;
}

export const purchaseRequestHeaders: { [key: string]: CellValue<InventoryPurchaseRequestListDto> } = {
  '采购单据编号': (item) => item.code ?? '',
  '状态': (item) => getStatusLabel(item.status),
  '供应商': (item) => item.supplierName ?? '',
  '录入部门': (item) => item.organizeName ?? '',
  '录入人': (item) => item.createByName ?? '',
  '采购仓库': (item) => item.inventoryInHouseName ?? '',
  '流程名称': (item) => item.workflowDefinitionName ?? '',
  '当前步骤': (item) => {
    if (item.workflowInstanceStatus?.length !== 0 && item.todoHandleUsersName?.length !== 0) {
      return `${item.workflowInstanceStatus}(${item.todoHandleUsersName})`;
    }
    return "";
  },
  '备注': (item) => item.remark ?? '',
};

export const purchaseRequestGoodHeaders: { [key: string]: CellValue<InventoryPurchaseRequestGoodExcelDto> } = {
  '采购单据编号': (item) => item.inventoryPurchaseRequestCode ?? '',
  '录入部门': (item) => item.organizeName,
  '录入人': (item) => item.createByName,
  '录入时间': (item) => toStringOfDay(item.createTime) ,
  '采购仓库': (item) => item.inventoryInHouseName,
  '物资名称': (item) => item.goodName,
  '物资编码': (item) => item.goodCode,
  '税前单价': (item) => item.unitPriceBeforeTax.toString(),
  '税后单价': (item) => item.unitPriceAfterTax.toString(),
  '单位': (item) => item.unitName ?? '',
  '采购数量': (item) => item.amount.toString(),
  '税前总价': (item) => (item.unitPriceBeforeTax * item.amount).toString(),
  '税后总价': (item) => (item.unitPriceAfterTax * item.amount).toString(),
  '备注': (item) => item.remark ?? ''
};

