
import {request} from "@@/exports";
import SystemConst from "@/utils/const";
import {
  InventoryInAddDto,
  InventoryInDetailGoodDto,
  InventoryInQueryParam
} from "@/pages/inventory/in/type";
import qs from "qs";

const InventoryInService= {
  list: (params: InventoryInQueryParam) => request(`/${SystemConst.API_BASE}/inventory-ins`, {
    method: 'GET',
    params,
    paramsSerializer:(params)=>{
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  }),
  //删除
  delete:(id:number)=>request(`/${SystemConst.API_BASE}/inventory-ins/${id}`,{
    method: 'DELETE',
  }),
  //获取执行物资
  getGoods:(id:number)=>request<InventoryInDetailGoodDto[]>(`/${SystemConst.API_BASE}/inventory-ins/${id}/goods`,{
    method: 'GET',
  }),

  //获取导出物资
  getGoodsExcel:(params: InventoryInQueryParam) => request(`/${SystemConst.API_BASE}/inventory-ins/goods-excel`, {
    method: 'GET',
    params,
    paramsSerializer:(params)=>{
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  }),

  //提交执行物资
  execute:(id:number,inventoryGoods:InventoryInDetailGoodDto[])=>request(`/${SystemConst.API_BASE}/inventory-ins/${id}/execute`,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json', // 确保请求体的类型为 JSON
    },
    body: JSON.stringify(inventoryGoods),
  }),

  //新增
  add:(inventoryInAddDto:InventoryInAddDto)=>request(`/${SystemConst.API_BASE}/inventory-ins/add-start`,
    {
      method: 'POST',
      body: JSON.stringify(inventoryInAddDto),
    }
  ),

  //保存
  save:(inventoryInAddDto:InventoryInAddDto)=>request(`/${SystemConst.API_BASE}/inventory-ins/add`,
    {
      method: 'POST',
      body: JSON.stringify(inventoryInAddDto),
    }
    ),

  //删除
  scrapInventoryIn:(id:number)=>request(`/${SystemConst.API_BASE}/inventory-ins/${id}/scrap`,{
    method: 'PUT',
  })
}

export  default  InventoryInService;
