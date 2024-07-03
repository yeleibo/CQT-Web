import {request} from "@umijs/max";
import SystemConst from "@/utils/const";
import {EngineeringItem, EngineeringParams} from "@/pages/Engineering/typings";

const EngineeringService={
   list:(params:EngineeringParams)=> request<EngineeringItem[]>(`/${SystemConst.API_BASE}/engineerings`, {
    method: 'GET',
     params,
  }),
  //新增
  add:(item:EngineeringItem)=>request(`/${SystemConst.API_BASE}/engineerings`,{
    method: 'POST',
    data:item,
  }),
  //新增
  update:(item:EngineeringItem)=>request(`/${SystemConst.API_BASE}/engineerings`,{
    method: 'PUT',
    data:item
  }),
  //新增
  delete:(id:number)=>request(`/${SystemConst.API_BASE}/engineerings/${id}`,{
    method: 'DELETE',
  })
}

export default EngineeringService;
