import { PageParams } from '@/models/page';

export type CodeCreateDto = {
  name: string;
  preCode: string;
  codeLength: number;
  amount?: number;
};

export type CodeCreateDto1 = {
  dto: CodeCreateDto[];
};

export type CodeCreateResultDto = {
  preCode: string;
  codes: string[];
};

export type CodeOrder = {
  id: number;
  name: string;
  /**
   * 运营商
   */
  ispId: number;
  ispName: string;
  /**
   * 业务员
   */
  salesperson?: string;
  /**
   * 客户联系方式
   */
  customerContact?: string;
  /**
   * 业务订单号
   */
  saleOrderNumber?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 编码是否随机生成
   */
  isRandom: boolean;
  /**
   * CodeAddDto 列表
   */
  codes: CodeDetailDto[];

  //配置方案
  configPlan: string;
};

export type CodeDetailDto = {
  codePre: string;
  amount: number;
};

export type CodeOrderParam = PageParams & {
  keyword: string;
};
