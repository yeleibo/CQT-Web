import { CellValue } from '@/components/ExcelButton/ExportButton';
import { PageParams } from '@/models/page';

export type InventorySheetListDto = {
  id?: number;
  code?: string;
  inventorySheetTime?: Date;
  inventorySheetUserName?: string;
  inventorySheetUserId?: number;
  inventoryHouseName?: string;
  inventoryHouseId?: number;
  organizeId?: number;
  todoHandleUsersName?: string;
  workflowInstanceStatus?: string;
  organizeName?: string;
  workflowDefinitionId?: string;
  workflowInstanceId?: string;
  remark?: string;
};

export type InventorySheetQueryParam = PageParams & {
  keyword?: string;
};

export type InventorySheetGoods = {
  goodId: number;
  goodName?: string;
  goodCode?: string;
  unitName?: string;
  beforeAmount: number;
  afterAmount: number;
  remark?: string;
  actualAmount?: number;
  totalChangePrice?: number;
  changeAmount?: number;
  unitPrice: number;
  type: GoodType;
};

export enum GoodType {
  handicap = 'handicap',
  loss = 'loss',
  consistent = 'consistent',
}

export function toString(type: GoodType): string {
  switch (type) {
    case GoodType.handicap:
      return '盘盈';
    case GoodType.loss:
      return '盘亏';
    case GoodType.consistent:
      return '账实相符';
    default:
      throw new Error(`Unknown GoodType: ${type}`);
  }
}

const SheetGoodHeaders: { [key: string]: CellValue<InventorySheetGoods> } = {
  物资编码: (item) => item.goodCode ?? '',
  物资名称: (item) => item.goodName ?? '',
  单位: (item) => item.unitName ?? '',
  盘点前数量: (item) => item.beforeAmount?.toString() ?? '',
  实际数量: (item) => item.afterAmount?.toString() ?? '',
  变更数量: (item) =>
    item.beforeAmount === null || item.afterAmount === null
      ? ''
      : (item.afterAmount - item.beforeAmount).toString() ?? '',
  单价: (item) => item.unitPrice?.toString() ?? '',
  变更金额: (item) =>
    item.unitPrice === null || item.beforeAmount === null || item.afterAmount === null
      ? ''
      : ((item.afterAmount - item.beforeAmount) * item.unitPrice).toString() ?? '',
  实际金额: (item) =>
    item.unitPrice === null || item.afterAmount === null
      ? ''
      : (item.afterAmount * item.unitPrice).toString() ?? '',
  备注: (item) => item.remark ?? '',
};
