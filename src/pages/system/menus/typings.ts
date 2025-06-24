export type Menus = {
  id: number;
  parentId?: number;
  name: string;
  redirect?: string;
  orderNumber?: number;
  path: string;
  component?: string;
  remark?: string;
  icon: string;
  children?: Menus[];
};
