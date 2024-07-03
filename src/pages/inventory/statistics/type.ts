import {PageParams} from "@/models/page";

export type EngineeringInventoryOutGood = {
  engineeringName: string;
  engineeringCode: string;
  inventoryOutHouseId: number;
  inventoryOutHouseName: string;
  goodId: number;
  goodName: string;
  goodCode: string;
  amount: number;
}

export type EngineeringInventoryOutGoodsQueryParam = {
  engineeringKeyword?: string;
  goodKeyword?: string;
  recipient?: string;
  inventoryOutHouseIds?: number[];
  startTime?: Date;
  endTime?: Date;
}

export type EngineeringRemainderGoodsStatistics = {
  goodId: number;
  goodName: string;
  goodCode: string;
  unitName: string;
  unitPriceBeforeTax: number;
  remainderAmount: number;
  remainderAvailableAmount: number;
  inventoryHouseName: string;
  engineeringName: string;
  engineeringCode: string;
  totalAvailableFinancialAmount: number;
}

export type EngineeringRemainderGoodsStatisticsQueryParam = PageParams &
  {
    keyword?: string;
    engineeringIds?: number[];
    goodIds?: number[];
    inventoryHouseIds?: number[];
  }

  export type  FixedAssetStatistics = {
    inventoryHouseName: string;
    fixedAssetName: string;
    amount: number;
    financialAmount: number;
  }

  export type  FixedAssetStatisticsQueryParam = PageParams & {
    startTime?: Date;
    endTime?: Date;
    keyword?: string;
    inventoryHouseIds?: number[];
  }

  export type InventoryStatisticsHouse = {
    inventoryHouseName?: string;
    inventoryHouseId?: number;
    inventoryInCode?: string;
    batchNumber?: string;
    goodName: string;
    goodId?: number;
    amount: number;
    unitName?: string;
    availableAmount: number;
    lowestSafeAmount?: number;
    financialAmount: number;
    financialAvailableAmount: number;
    highestSafeAmount?: number;
  }

  export type InventoryStatisticsHouseWarnQueryParam = PageParams & {
    keyword?: string;
    inventoryHouseIds?: number[];
  }

  export type GoodBatchStatisticsQueryParam = PageParams & {
    keyword?: string;
    goodId?: number;
    inventoryHouseIds?: number[];
  }

  export type InventoryFinanceStatisticsListDto = {
    goodName: string;
    goodUnitName: string;
    startTime: Date;
    endTime: Date;
    typeName: string;
    code: string;
    remark: string;
    inventoryHouseName: string;

    // 期初均价
    startTimeUnitPrice: number;
    // 期初数量
    startTimeAmount: number;
    // 期初总价
    startTimeTotalPrice: number;

    // 期末均价
    endTimeUnitPrice: number;
    // 期末数量
    endTimeAmount: number;
    // 期末总价
    endTimeTotalPrice: number;

    // 发出均价
    outUnitPrice: number;
    // 发出数量
    outAmount: number;
    // 发出总价
    outTotalPrice: number;

    // 入库均价
    inUnitPrice: number;
    // 入库数量
    inAmount: number;
    // 入库总价
    inTotalPrice: number;
  }

  export type GoodInventoryFinanceStatisticsQueryParam = PageParams & {
    startTime?: Date;
    endTime?: Date;
    keyword?: string;
    inventoryHouseIds?: number[];
  }

  export type InventoryInGoodList = {
    inventoryInId: number;
    inventoryInCode?: string;
    inventoryInHouseName: string;
    goodId: number;
    goodName: string;
    goodCode: string;
    unitPriceBeforeTax: number;
    unitPriceAfterTax: number;
    amount: number;
    executedAmount: number;
    isZeroPrice?: boolean;
    remark?: string;
  }

  export type GoodInventoryInStatisticsQueryParam = PageParams & {
    keyword?: string;
    startTime?: Date;
    endTime?: Date;
    inventoryInHouseIds?: number[];
  }

  export type InventoryOutGoodList = {
    inventoryOutId: number;
    inventoryOutCode: string;
    goodId: number;
    goodName: string;
    goodCode?: string;
    inventoryOutHouseName: string;
    amount: number;
    executedAmount: number;
    recipient: string;
    remark?: string;
  }

  export type GoodInventoryOutStatisticsQueryParam = PageParams & {
    startTime?: Date;
    endTime?: Date;
    keyword?: string;
    inventoryOutHouseIds?: number[];
    recipient?: string;
  }

  export type GoodTransferStatisticsListDto = {
    goodId: number;
    goodName?: string;
    goodCode?: string;
    unitName?: string;
    amount?: number;
    executedAmount?: number;
    inventoryInHouseName?: string;
    inventoryOutHouseName?: string;
    inventoryTransferCode?: string;
    remark?: string;
  }

  export type GoodInventoryTransferStatisticsQueryParam = PageParams & {
    transferMethods?: InventoryTransferMethod[];
    startTime?: Date;
    endTime?: Date;
    keyword?: string;
    inventoryOutHouseIds?: number[];
    inventoryInHouseIds?: number[];
  }

enum InventoryTransferMethod {
  // 调入主库
  secondaryToMain = 0,
  // 调出主库
  mainToSecondary = 1,
  // 乡镇调
  secondaryToSecondary = 2,
}

  export type SuggestedPurchaseGood = {
    goodName?: string;
    goodCode?: string;
    goodUnitName?: string;
    prePurchaseRequestAmount?: number;
    transferredGoodAmount?: number;
    unInventoryInAmount?: number;
    mainInventoryHouseAmount?: number;
    suggestedPurchaseAmount?: number;
  }

  export type SuggestedPurchaseGoodQueryParam = {
    keyword?: string;
  }


