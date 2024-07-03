import {request} from "@umijs/max";
import SystemConst from "@/utils/const";
import {InventorySheetListDto, InventorySheetQueryParam} from "@/pages/inventory/sheet/type"



const InventorySheetService = {
  list:(params:InventorySheetQueryParam)=> request<InventorySheetListDto[]>(`/${SystemConst.API_BASE}/inventory-sheets`, {
    method: 'GET',
    params,
  }),

  //新增
  delete:(id:number)=>request(`/${SystemConst.API_BASE}/inventory-sheets/${id}`,{
    method: 'DELETE',
  })
}

export default InventorySheetService;
