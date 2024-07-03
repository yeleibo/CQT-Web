import {request} from "@umijs/max";
import SystemConst from "@/utils/const";
import {
  InventoryPurchaseRequestListDto,
  InventoryPurchaseRequestQueryParam
} from "@/pages/inventory/purchase-request/type";
import qs from "qs";

const PurchaseRequestService = {
  getInventoryPurchaseRequest:(params:InventoryPurchaseRequestQueryParam)=> request(`/${SystemConst.API_BASE}/inventory-purchase-requests`, {
    method: 'GET',
    params,
    paramsSerializer:(params)=>{
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  }),

  getGoodExcel:(params:InventoryPurchaseRequestQueryParam)=> request(`/${SystemConst.API_BASE}/inventory-purchase-requests/goods-excel`, {
    method: 'GET',
    params,
    paramsSerializer:(params)=>{
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  }),

  delete:(id:number)=>request(`/${SystemConst.API_BASE}/inventory-purchase-requests/${id}`,{
    method: 'DELETE',
  })
}

export default PurchaseRequestService
