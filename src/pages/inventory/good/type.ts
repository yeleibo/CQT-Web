import {PageParams} from "@/models/page";
import {CellValue} from "@/components/ExcelButton/ExportButton";

export type Good = {
  id: number;
  name: string;
  code: string;
  goodTypeId: number;
  unitName: string;
  assetType?: string;
  unitPriceBeforeTax: number;
  unitPriceAfterTax: number;
  lowestSafeAmount?: number;
  highestSafeAmount?: number;
  orderNumber?: number;
  remark?: string;
  goodTypeSysCode: string;
  goodTypeName?: string;
}

export type GoodQueryParam = PageParams & {
  keyword?: string;
  goodTypeSysCodes?:string[];
}

export const goodHeaders: { [key: string]: CellValue<Good> } = {
  '物资名称': (item) => item.name,
  '物资编码': (item) => item.code,
  '所属目录': (item) => item.goodTypeName,
  '单位': (item) => item.unitName,
  '固定资产': (item) => item.assetType,
  '税前价格': (item) => item.unitPriceBeforeTax?.toString() ?? '',
  '税后价格': (item) => item.unitPriceAfterTax?.toString() ?? '',
  '最低报警数量': (item) => item.lowestSafeAmount?.toString() ?? '',
  '最高报警数量': (item) => item.highestSafeAmount?.toString() ?? '',
};
