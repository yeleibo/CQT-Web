import {request} from "@umijs/max";
import SystemConst from "@/utils/const";
import {Good, GoodQueryParam} from "@/pages/inventory/good/type";
import qs from "qs";


const GoodService={

  list:(params:GoodQueryParam)=> request<Good[]>(`/${SystemConst.API_BASE}/goods`, {
    method: 'GET',
    params,
    paramsSerializer:(params)=>{
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  }),
  //新增
  add:(item:Good)=>request(`/${SystemConst.API_BASE}/goods`,{
    method: 'POST',
    data:item,
  }),
  //修改
  update:(item:Good)=>request(`/${SystemConst.API_BASE}/goods`,{
    method: 'PUT',
    data:item
  }),
  //新增
  delete:(id:number)=>request(`/${SystemConst.API_BASE}/goods/${id}`,{
    method: 'DELETE',
  })
}

export default GoodService;


