import {request} from "@umijs/max";
import SystemConst from "@/utils/const";
import {SupplierItem,SupplierParams} from "@/pages/inventory/supplier/typings";
import qs from "qs";

const SupplierService={
  list:(params:SupplierParams)=> request<SupplierItem[]>(`/${SystemConst.API_BASE}/suppliers`, {
    method: 'GET',
    params,
    paramsSerializer:(params)=>{
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  }),
  //新增
  add:(item:SupplierItem)=>request(`/${SystemConst.API_BASE}/suppliers`,{
    method: 'POST',
    data:item,
  }),
  //修改
  update:(item:SupplierItem)=>request(`/${SystemConst.API_BASE}/suppliers`,{
    method: 'PUT',
    data:item
  }),
  //新增
  delete:(id:number)=>request(`/${SystemConst.API_BASE}/suppliers/${id}`,{
    method: 'DELETE',
  })
}

export default SupplierService;


