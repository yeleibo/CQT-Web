import { PageParams } from '@/models/page';

export type WorkflowDefinitionExtendInfo = {
  id: number;
  //流程名称
  name: string;
  //流程id
  workflowDefinitionId: string;
  //流程类型
  type: WorkflowDefinitionType;
  //流程所属信息
  organizeIds?: number[];
  organizeNames?: string[];
  //排序
  orderNumber?: number[];
  //备注
  remake?: string;
  //通用表单配置
  designable: Designable;
};

export type Designable = {
  formSchema: string;
  groupName: string;
  subGroupName?: string;
};

//查询
export type WorkflowDefinitionExtendInfosQueryParam = PageParams & {
  organizeIds?: number;
  type?: WorkflowDefinitionType;
  isDesigned?: boolean;
};

export enum WorkflowDefinitionType {
  contract = 0,
  inventoryPurchaseRequest = 1,
  inventoryPurchase = 2,
  inventoryIn = 3,
  inventoryOut = 4,
  inventoryTransfer = 5,
  inventoryRollback = 6,
  engineering = 7,
  inventoryInvoice = 8,
  inventoryEngineeringTransfer = 9,
  engineeringGoodChangeRecord = 10,
  deqingEngineeringDispatchWorkOrder = 11,
  deqingPurchaseRequest = 12,
  deqingRepairWorkOrder = 13,
  fileApproval = 14,
  deqingOldGoodsHandle = 15,
  workOrder = 16,
  commonForm = 17,
  inventorySheet = 18,
  inventoryPrePurchaseRequest = 19,
}

export function getWorkflowDefinitionTypeLabel(type: WorkflowDefinitionType): string {
  switch (type) {
    case WorkflowDefinitionType.contract:
      return '合同';
    case WorkflowDefinitionType.inventoryPurchaseRequest:
      return '采购单据';
    case WorkflowDefinitionType.inventoryPurchase:
      return '进货单据';
    case WorkflowDefinitionType.inventoryIn:
      return '入库单据';
    case WorkflowDefinitionType.inventoryOut:
      return '出库单据';
    case WorkflowDefinitionType.inventoryTransfer:
      return '移库单据';
    case WorkflowDefinitionType.inventoryRollback:
      return '回退单据';
    case WorkflowDefinitionType.engineering:
      return '工程';
    case WorkflowDefinitionType.inventoryInvoice:
      return '发票单据';
    case WorkflowDefinitionType.inventoryEngineeringTransfer:
      return '工程调剂单据';
    case WorkflowDefinitionType.engineeringGoodChangeRecord:
      return '工程物资变更';
    case WorkflowDefinitionType.deqingEngineeringDispatchWorkOrder:
      return '派工单';
    case WorkflowDefinitionType.deqingPurchaseRequest:
      return '采购申请';
    case WorkflowDefinitionType.fileApproval:
      return '文件审查';
    case WorkflowDefinitionType.deqingRepairWorkOrder:
      return '维修工单';
    case WorkflowDefinitionType.deqingOldGoodsHandle:
      return '废旧物资处置';
    case WorkflowDefinitionType.workOrder:
      return '工单';
    case WorkflowDefinitionType.commonForm:
      return '通用';
    case WorkflowDefinitionType.inventorySheet:
      return '盘点单';
    case WorkflowDefinitionType.inventoryPrePurchaseRequest:
      return '要货单据';
    default:
      return '未知流程';
  }
}
