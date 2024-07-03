import { CellValue } from '@/components/ExcelButton/ExportButton';
import { toStringOfDay } from '@/components/Extension/DateTime';
import { PageParams } from '@/models/page';

export type InventoryInvoiceListDto = {
  code?: string;
  inventoryInvoiceCode?: string;
  createByName?: string;
  createTime?: Date;
  invoiceDate?: Date;
  organizeName?: string;
  houseName?: string;
  supplierName?: string;
  workflowDefinitionName?: string;
  workflowInstanceId?: string;
  todoHandleUsersName?: string;
  workflowInstanceStatus?: string;
  remark?: string;
  status: FormStatusCommon;
  amountAfterTax?: number;
  id: number;
};

export enum FormStatusCommon {
  unStart = 0,
  running = 1,
  finished = 2,
  faulted = 3,
  cancelled = 4,
}

export function getStatusLabel(status: FormStatusCommon): string {
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

export function getStatusColor(status: FormStatusCommon, isText: boolean): string {
  switch (status) {
    case FormStatusCommon.unStart:
      return isText ? '#9E9E9EFF' : '#9E9E9E14'; // 灰色
    case FormStatusCommon.running:
      return isText ? '#2196F3FF' : '#2196F314'; // 蓝色
    case FormStatusCommon.finished:
      return isText ? '#4CAF50FF' : '#4CAF5014'; // 绿色
    case FormStatusCommon.faulted:
      return isText ? '#F44336FF' : '#F4433614'; // 红色
    case FormStatusCommon.cancelled:
      return isText ? '#009688FF' : '#00968814'; // 青色
    default:
      return isText ? '#FFFFFFFF' : '#FFFFFF14'; // 白色
  }
}

export type InventoryInvoiceQueryParam = PageParams & {
  keyword?: string;
  startInvoiceDate?: Date;
  endInvoiceDate?: Date;
  organizeIds?: number[];
  supplierIds?: number[];
  status?: FormStatusCommon[];
  excludedStatus?: FormStatusCommon[];
};

export type InventoryInvoiceGood = {
  inventoryPurchaseGoodId: number;
  inventoryPurchaseCode?: string;
  goodId?: number;
  goodCode: string;
  goodName: string;
  unitName: string;
  unitPriceBeforeTax: number;
  unitPriceAfterTax: number;
  amount: number;
  totalPriceBeforeTax?: number;
  totalPriceAfterTax?: number;
  batchNumber?: string;
  buyTime?: Date;
  remark?: string;
};

export type InventoryInvoiceGoodDetailExcelDto = InventoryInvoiceGood & {
  inventoryInvoiceCode: string;
  createTime: Date;
  createByName: string;
  organizeName: string;
};

export const invoiceHeaders: { [key: string]: CellValue<InventoryInvoiceListDto> } = {
  发票单据编号: (item) => item.code ?? '',
  状态: (item) => getStatusLabel(item.status),
  供应商: (item) => item.supplierName ?? '',
  录入部门: (item) => item.organizeName ?? '',
  录入人: (item) => item.createByName ?? '',
  录入时间: (item) => (item.createTime ? toStringOfDay(item.createTime) : ''),
  相关仓库: (item) => item.houseName ?? '',
  开票时间: (item) => (item.invoiceDate ? toStringOfDay(item.invoiceDate) : ''),
  发票号: (item) => item.inventoryInvoiceCode ?? '',
  流程名称: (item) => item.workflowDefinitionName ?? '',
  当前步骤: (item) =>
    item.workflowInstanceStatus?.length === 0 && item.todoHandleUsersName?.length === 0
      ? ''
      : `${item.workflowInstanceStatus}(${item.todoHandleUsersName})`,
  备注: (item) => item.remark ?? '',
};

export const invoiceGoodHeaders: { [key: string]: CellValue<InventoryInvoiceGoodDetailExcelDto> } =
  {
    发票单据编号: (item) => item.inventoryInvoiceCode,
    进货单据编号: (item) => item.inventoryPurchaseCode ?? '',
    录入部门: (item) => item.organizeName,
    录入人: (item) => item.createByName,
    录入时间: (item) => toStringOfDay(item.createTime),
    进货日期: (item) => (item.buyTime ? toStringOfDay(item.buyTime) : ''),
    物资名称: (item) => item.goodName,
    批次编号: (item) => item.batchNumber ?? '',
    税前单价: (item) => item.unitPriceBeforeTax.toString(),
    税后单价: (item) => item.unitPriceAfterTax.toString(),
    进货数量: (item) => item.amount.toString(),
    税前总价: (item) => (item.unitPriceBeforeTax * item.amount).toString(),
    税后总价: (item) => (item.unitPriceAfterTax * item.amount).toString(),
    备注: (item) => item.remark ?? '',
  };
