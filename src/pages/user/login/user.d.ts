type LoginParam = {
  username: string;
  password: string;
  account?:string;
};


type UserInfo = {
  userId?: string;
  user: Partial<UserBase>;
  token?: string;
  permissionCodes?: string[];
  managementInventoryHouseIds: number[]
};


type UserBase = {
  id: number;
  name: string;
  account: string;
  organizeName: string;
  signature: Uint8Array
};
