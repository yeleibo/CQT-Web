import {PageParams} from "@/models/page";
import {CellValue} from "@/components/ExcelButton/ExportButton";
import {toStringOfDay} from "@/components/Extension/DateTime";

export type PrePurchaseRequestParam = PageParams & {
  keyword?: string;
}

export type PrePurchaseRequestAdd = {
  id?: number;
  engineeringId?: number;
  code?: string;
  workflowDefinitionId?: string;
  workflowDefinitionName?: string;
  organizeId?: number;
  engineeringName?: string;
  organizeName?: string;
  remark?: string;
  goods: InventoryPrePurchaseRequestGoodDto[];
}

export type InventoryPrePurchaseRequestGoodDto = {
  id?: number;
  goodId: number;
  goodName?: string;
  goodCode?: string;
  unitName?: string;
  inventoryPrePurchaseRequestId?: number;
  amount: number;
  unitPriceBeforeTax?: number;
  unitPriceAfterTax?: number;
  remark?: string;
}

export type PrePurchaseRequestList = {
  id: number;
  code?: string;
  createByName?: string;
  createTime?: Date;
  organizeName: string;
  organizeId: number;
  engineeringId?: number;
  engineeringName?: string;
  todoHandleUsersName?: string;
  workflowInstanceStatus?: string;
  remark?: string;
  goods?: InventoryPrePurchaseRequestGoodDto[];
}

export const prePurchaseRequestHeaders: { [key: string]: CellValue<PrePurchaseRequestList> } = {
  "编号": (item) => item.code ?? '',
  "录入部门": (item) => item.organizeName,
  "录入人": (item) => item.createByName ?? '',
  "录入时间": (item) => item.createTime ? toStringOfDay(item.createTime) : '',
  "当前步骤": (item) => {
    if (item.todoHandleUsersName?.length !== 0 && item.workflowInstanceStatus?.length !== 0) {
      return `${item.workflowInstanceStatus}(${item.todoHandleUsersName})`;
    }
    return "";
  },
  "备注": (item) => item.remark ?? '',
};
