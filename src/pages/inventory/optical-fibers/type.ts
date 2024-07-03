import {PageParams} from "@/models/page";

export type InventoryOutOpticalFiberListDto = {
  id?: number;
  // 光纤盘号
  code?: string;
  // 光纤长度
  length?: number;
  // 光纤类型
  goodId?: number;
  goodName?: string;
  // 领料人
  recipient?: string;
  // 出库部门id
  inventoryOutOrganizeId?: number;
  // 备注
  remark?: string;
  // 出库部门
  inventoryOutOrganizeName?: string;
  // 物资单号
  inventoryCode?: string;
  // 状态
  status?: string;
  // 创建时间
  createTime?: Date;
  // 出库时间
  inventoryOutTime?: Date;
}

export type InventoryOutOpticalFibersQueryParam = PageParams & {
  // 最小长度
  minLength?: number;
  // 最大长度
  maxLength?: number;
  // 类型
  goodId?: number;
  // 是否出库
  isOut?: boolean;
  // 关键字
  keyword?: string;
}

export const fibers: { [key: number]: string } = {
  311: 'GYXTY-4B光缆',
  312: 'GYXTY-8B光缆',
  313: 'GYXTY-12B光缆',
  314: 'GYTS-4B光缆',
  315: 'GYTS-8B光缆',
  316: 'GYTS-24B光缆',
  318: 'GYTS-12B光缆',
  319: 'GYTS-48B光缆',
  320: 'GYTS-72B光缆',
  331: 'GYTA53-24B光缆（防鼠）',
  332: 'GYTA53-36B光缆（防鼠）',
  334: 'GYTA53-48B光缆（防鼠）',
  335: 'GYTA53-72B光缆（防鼠）',
  1514: 'GYXTS-8B1.3光缆',
  1606: 'GYTA53-144B光缆（防鼠）',
};
