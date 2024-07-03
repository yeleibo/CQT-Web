import {request} from "@umijs/max";
import SystemConst from "@/utils/const";
import {
  InventoryPurchaseGood,
  InventoryPurchaseQueryParam
} from "@/pages/inventory/purchase/type";
import qs from "qs";


const PurchaseService = {
  getInventoryPurchaseRequest:(params:InventoryPurchaseQueryParam)=> request(`/${SystemConst.API_BASE}/inventory-purchases`, {
    method: 'GET',
    params,
    paramsSerializer:(params)=>{
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  }),

  //获取执行物资
  goods:(id:number)=>request<InventoryPurchaseGood[]>(`/${SystemConst.API_BASE}/inventory-purchases/${id}/goods`,{
         method: 'GET',
  }),

  getGoodExcel:(params:InventoryPurchaseQueryParam)=> request(`/${SystemConst.API_BASE}/inventory-purchases/goods-excel`, {
    method: 'GET',
    params,
    paramsSerializer:(params)=>{
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  }),

  delete:(id:number)=>request(`/${SystemConst.API_BASE}/inventory-purchases/${id}`,{
    method: 'DELETE',
  })
}

export default PurchaseService
