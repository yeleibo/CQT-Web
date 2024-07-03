import {request} from "@umijs/max";
import SystemConst from "@/utils/const";
import {
  InventoryOutOpticalFiberListDto,
  InventoryOutOpticalFibersQueryParam
} from "@/pages/inventory/optical-fibers/type";


const OpticalFibersService = {

  getRecipients:() => request<string[]>(`/${SystemConst.API_BASE}/inventory-out-optical-fibers/recipients`,{
    method: 'GET',
  }),

  list:(params:InventoryOutOpticalFibersQueryParam)=> request<InventoryOutOpticalFiberListDto[]>(`/${SystemConst.API_BASE}/inventory-out-optical-fibers`, {
    method: 'GET',
    params,
  }),
  //新增
  add:(item:InventoryOutOpticalFiberListDto)=>request(`/${SystemConst.API_BASE}/inventory-out-optical-fibers`,{
    method: 'POST',
    data:item,
  }),
  //修改
  update:(item:InventoryOutOpticalFiberListDto)=>request(`/${SystemConst.API_BASE}/inventory-out-optical-fibers`,{
    method: 'PUT',
    data:item
  }),
  //新增
  delete:(id:number)=>request(`/${SystemConst.API_BASE}/inventory-out-optical-fibers/${id}`,{
    method: 'DELETE',
  })
}

export default OpticalFibersService;
