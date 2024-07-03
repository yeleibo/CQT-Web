export type GoodType = {
  id?: number;
  name: string;
  sysCode: string;
  orderNumber?: number;
  parentId?: number;
  remark?: string;
}

export type GoodTypeData = {
  id?: number;
  name: string;
  sysCode: string;
  orderNumber?: number;
  parentId?: number;
  remark?: string;
  children?: GoodTypeData[];
}
