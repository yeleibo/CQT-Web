import { PageParams } from '@/models/page';

//用户
export type UserItem = {
  id?: number;
  //账号
  account: string;
  //姓名
  name: string;
  //部门
  organizeId: number;
  organizeName: string;
  //手机号
  phoneNumber: string;
  //管理部门
  userManagementOrganizes: UserManagementOrganize[];
  //管理仓库
  userManagementInventoryHouses: UserManagementInventoryHouse[];
  //用户分组
  userGroupIds: number[];
};

//查询
export type UsersQueryParam = PageParams & {
  organizeIds?: number[];
  ids?: number[];
};

export type UserManagementOrganize = {
  organizeId: number;
  organizeName: string;
};

export type UserManagementInventoryHouse = {
  inventoryHouseId: number;
  inventoryHouseName: string;
};

export type SendNotificationParam = {
  userIds: number[];
  message?: string;
  isSendNotificationByMobileApp: boolean;
  isSendNotificationBySMS: boolean;
};
