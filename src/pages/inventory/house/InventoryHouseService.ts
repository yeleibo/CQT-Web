import {request} from "@umijs/max";
import SystemConst from "@/utils/const";
import {InventoryHouseListDto,InventoryHouseQueryParam} from "@/pages/inventory/house/type"


const InventoryHouseService = {
  //获取仓库
  getAllInventoryHouse:()=> request<InventoryHouseListDto[]>(`/${SystemConst.API_BASE}/inventory-house`, {
    method: 'GET',
  }),

  list:(params:InventoryHouseQueryParam)=> request<InventoryHouseListDto[]>(`/${SystemConst.API_BASE}/inventory-house`, {
    method: 'GET',
    params,
  }),
  //新增
  add:(item:InventoryHouseListDto)=>request(`/${SystemConst.API_BASE}/inventory-house`,{
    method: 'POST',
    data:item,
  }),
  //修改
  update:(item:InventoryHouseListDto)=>request(`/${SystemConst.API_BASE}/inventory-house`,{
    method: 'PUT',
    data:item
  }),
  //新增
  delete:(id:number)=>request(`/${SystemConst.API_BASE}/inventory-house/${id}`,{
    method: 'DELETE',
  })
}

export default InventoryHouseService;
