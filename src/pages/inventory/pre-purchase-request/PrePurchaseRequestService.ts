import {request} from "@umijs/max";
import SystemConst from "@/utils/const";
import {PrePurchaseRequestParam,PrePurchaseRequestAdd,PrePurchaseRequestList} from "@/pages/inventory/pre-purchase-request/type";


const PrePurchaseRequestService={
  list:(params:PrePurchaseRequestParam)=> request(`/${SystemConst.API_BASE}/inventory-pre-purchase-requests`, {
    method: 'GET',
    params,
  }),

  getDetail:(id:number)=>request<PrePurchaseRequestAdd>(`/${SystemConst.API_BASE}/inventory-pre-purchase-requests/add-detail/${id}`  ,
    {
      method: 'Get',
    }
  ),
  //新增
  addStart:(item:PrePurchaseRequestAdd)=>request(`/${SystemConst.API_BASE}/inventory-pre-purchase-requests/add-start`,{
    method: 'POST',
    data:item,
  }),
  add:(item:PrePurchaseRequestAdd)=>request(`/${SystemConst.API_BASE}/inventory-pre-purchase-requests/add`,{
    method: 'POST',
    data:item,
  }),
  //修改
  update:(item:PrePurchaseRequestAdd)=>request(`/${SystemConst.API_BASE}/inventory-pre-purchase-requests`,{
    method: 'PUT',
    data:item
  }),
  //新增
  delete:(id:number)=>request(`/${SystemConst.API_BASE}/inventory-pre-purchase-requests/${id}`,{
    method: 'DELETE',
  })
}

export default PrePurchaseRequestService;


