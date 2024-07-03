import {PageParams} from "@/models/page";
import {CellValue} from "@/components/ExcelButton/ExportButton";

export type InventoryHouseListDto = {
  id?: number;
  name: string;
  organizeId?: number;
  auxiliaryOrganizeIds?: number[];
  address: string;
  receiver?: string;
  masterId?: number;
  isMain: boolean;
  orderNumber: number;
  remark?: string;
  organizeName: string;
  auxiliaryOrganizeNames?: string[];
}

export type InventoryHouseQueryParam = PageParams &{
  keyword?: string;
  isMain?: boolean;
}

export const houseHeaders: { [key: string]: CellValue<InventoryHouseListDto> } = {
  '仓库名称': (item) => item.name,
  '仓库地址': (item) => item.address,
  '部门名称': (item) => item.organizeName,
  '附属部门': (item) => item.auxiliaryOrganizeNames?.join(',') ?? '',
  '是否主仓库': (item) => item.isMain ? "是" : "否",
  '排序': (item) => item.orderNumber?.toString() ?? '',
  '备注': (item) => item.remark?.toString() ?? '',
};
