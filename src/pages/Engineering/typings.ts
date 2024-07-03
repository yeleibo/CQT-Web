import {PageParams} from "@/models/page";

export  type EngineeringItem={
  id: number;
  name: string;
  organizeId?: number;
  organizeName?: string;
  masterId?: number;
  masterName?: string;
  code?: string;
  status?: EngineeringStatus;
  createOrganizeId?: number;
  inventoryConfirm?: boolean;
  createOrganizeName?: string;
  typeCode?: string;
  workflowDefinitionId?: string;
  workflowDefinitionName?: string;
  haveBudget: boolean;
  remark?: string;
}
export type EngineeringParams=PageParams & {
  keyword?:string;
}

export enum EngineeringStatus {
  "未知" = 0,
  "设计" = 1,
  "审核" = 2,
  "施工" = 3,
  "竣工" = 4,
  // "出库" = 5,
  "验收" = 6,
  "审计" = 7,
  "完成" = 8
}


