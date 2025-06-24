type LoginParam = {
  password: string;
  account:string;
};


type UserInfo = {
  user: Partial<UserBase>;
  token?: string;
  permissionCodes?: string[];
  managementInventoryHouseIds: number[];
  menus: Menus[];
};


type UserBase = {
  id: number;
  name: string;
  account: string;
  organizeName: string;
  signature: Uint8Array
};
