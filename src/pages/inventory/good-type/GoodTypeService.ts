import {request} from "@umijs/max";
import SystemConst from "@/utils/const";
import {GoodType} from "@/pages/inventory/good-type/type";


const GoodTypeService = {
  getGoodType:()=> request<GoodType[]>(`/${SystemConst.API_BASE}/good-types`, {
    method: 'GET',
  }),

  addGoodType:(item:GoodType)=>request(`/${SystemConst.API_BASE}/good-types`,{
    method: 'POST',
    data:item,
  }),

  //修改
  updateGoodType:(item:GoodType)=>request(`/${SystemConst.API_BASE}/good-types`,{
    method: 'PUT',
    data:item
  }),
  //新增
  delete:(id:number)=>request(`/${SystemConst.API_BASE}/good-types/${id}`,{
    method: 'DELETE',
  })
}

export default GoodTypeService
