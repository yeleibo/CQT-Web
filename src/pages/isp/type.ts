import { PageParams } from '@/models/page';

export type ISP = {
  id: number;
  name: string;
  /**
   * 地址
   */
  address?: string;
  /**
   * email
   */
  email?: string;
  /**
   * 联系人
   */
  contactPersonName?: string;
  /**
   * 联系人电话
   */
  contactPersonPhoneNumber?: string;
  /**
   * 服务器地址
   */
  server?: string;
  /**
   * 分组
   */
  group?: string;
  /**
   * 备注
   */
  remark?: string;
};

export type ISPParams = PageParams & {
  keyword?: string;
};
