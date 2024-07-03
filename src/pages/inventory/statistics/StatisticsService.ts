import {request} from "@umijs/max";
import SystemConst from "@/utils/const";
import {
  EngineeringInventoryOutGood,
  EngineeringInventoryOutGoodsQueryParam,
  EngineeringRemainderGoodsStatistics,
  EngineeringRemainderGoodsStatisticsQueryParam,
  FixedAssetStatistics,
  FixedAssetStatisticsQueryParam,
  InventoryStatisticsHouseWarnQueryParam,
  GoodInventoryInStatisticsQueryParam,
  InventoryInGoodList,
  InventoryStatisticsHouse,
  GoodBatchStatisticsQueryParam,
  GoodInventoryFinanceStatisticsQueryParam,
  InventoryFinanceStatisticsListDto,
  GoodInventoryOutStatisticsQueryParam,
  InventoryOutGoodList,
  GoodInventoryTransferStatisticsQueryParam,
  GoodTransferStatisticsListDto,
  SuggestedPurchaseGoodQueryParam,SuggestedPurchaseGood
} from "@/pages/inventory/statistics/type";

const StatisticsService={

  //工程出库统计
  getEngineeringInventoryOutGoods:(params:EngineeringInventoryOutGoodsQueryParam)=> request<EngineeringInventoryOutGood[]>(`/${SystemConst.API_BASE}/engineering/statistics/inventory-out-goods`, {
    method: 'GET',
    params,
  }),

  //工程剩余物资
  getEngineeringRemainderGoods:(params:EngineeringRemainderGoodsStatisticsQueryParam)=> request<EngineeringRemainderGoodsStatistics[]>(`/${SystemConst.API_BASE}/engineerings/remainder-goods`, {
    method: 'GET',
    params,
  }),

  ///固定资产统计
  fixedAssetStatistics:(params:FixedAssetStatisticsQueryParam)=> request<FixedAssetStatistics[]>(`/${SystemConst.API_BASE}/inventory-statistics/fixed-asset-statistics`, {
    method: 'GET',
    params,
  }),

  getGoodStatistics:(params:InventoryStatisticsHouseWarnQueryParam)=> request<InventoryStatisticsHouse[]>(`/${SystemConst.API_BASE}/inventory-statistics/good`, {
    method: 'GET',
    params,
  }),

  //仓库物资库存
  getHouseStatistics:(params:InventoryStatisticsHouseWarnQueryParam)=> request<InventoryStatisticsHouse[]>(`/${SystemConst.API_BASE}/inventory-statistics/house`, {
    method: 'GET',
    params,
  }),

  //物资批次库存
  getGoodBatchStatistics:(params:InventoryStatisticsHouseWarnQueryParam)=> request<InventoryStatisticsHouse[]>(`/${SystemConst.API_BASE}/inventory-statistics/good-batch`, {
    method: 'GET',
    params,
  }),

  //仓库物资批次库存
  getGoodBatchWithInventoryHouseStatistics:(params:GoodBatchStatisticsQueryParam)=> request<InventoryStatisticsHouse[]>(`/${SystemConst.API_BASE}/inventory-statistics/good-batch-with-inventory-house`, {
    method: 'GET',
    params,
  }),

  //财务统计
  goodInventoryFinanceStatistics:(params:GoodInventoryFinanceStatisticsQueryParam)=> request<InventoryFinanceStatisticsListDto[]>(`/${SystemConst.API_BASE}/inventory-statistics/good-inventory-finance-statistics`, {
    method: 'GET',
    params,
  }),

  //物资入库明细
  goodInventoryInStatistics:(params:GoodInventoryInStatisticsQueryParam)=> request<InventoryInGoodList[]>(`/${SystemConst.API_BASE}/inventory-statistics/good-inventory-in-statistics`, {
    method: 'GET',
    params,
  }),

  //物资出库明细
  goodInventoryOutStatistics:(params:GoodInventoryOutStatisticsQueryParam)=> request<InventoryOutGoodList[]>(`/${SystemConst.API_BASE}/inventory-statistics/good-inventory-out-statistics`, {
    method: 'GET',
    params,
  }),

  //物资调拨明细
  goodInventoryTransferStatistics:(params:GoodInventoryTransferStatisticsQueryParam)=> request<GoodTransferStatisticsListDto[]>(`/${SystemConst.API_BASE}/inventory-statistics/good-inventory-transfer-statistics`, {
    method: 'GET',
    params,
  }),

  //报警物资
  getHouseWarnStatistics:(params:InventoryStatisticsHouseWarnQueryParam)=> request<InventoryStatisticsHouse[]>(`/${SystemConst.API_BASE}/inventory-statistics/house-warn`, {
    method: 'GET',
    params,
  }),

  //采购建议
  getSuggestedPurchaseGood:(params:SuggestedPurchaseGoodQueryParam)=> request<SuggestedPurchaseGood[]>(`/${SystemConst.API_BASE}/inventory-statistics/suggested-purchase`, {
    method: 'GET',
    params,
  }),

}

export default StatisticsService;


