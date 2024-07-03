import {PageParams} from "@/models/page";
import {CellValue} from "@/components/ExcelButton/ExportButton";

export type SupplierParams = PageParams & {
   keyword?: string;
}

export  type  SupplierItem = {
  id?: number;
  name: string;
  code: string;
  groupCode: string;
  address: string;
  contactPersonName: string;
  contactPhoneNumber?: string;
  depositoryBank?: string;
  bankAccountNumber?: string;
  remark?: string;
}

export const supplierHeaders: { [key: string]: CellValue<SupplierItem> } = {
  '名称': (item) => item.name,
  '编码': (item) => item.code,
  '所属分组': (item) => item.groupCode,
  '地址': (item) => item.address,
  '联系人': (item) => item.contactPersonName,
  '联系电话': (item) => item.contactPhoneNumber ?? '',
  '开户银行': (item) => item.depositoryBank ?? '',
  '银行账号': (item) => item.bankAccountNumber ?? '',
  '备注': (item) => item.remark ?? ''
};
