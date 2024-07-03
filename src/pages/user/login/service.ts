import {request} from "@umijs/max";
import SystemConst from "@/utils/const";

const Service={
   login:(data:LoginParam)=> request(`/${SystemConst.API_BASE}/account/login`, {
    method: 'POST',
    data,
  }),
  queryCurrent: ()=> request<UserInfo>(`/${SystemConst.API_BASE}/users/me`, {
    method: 'GET',
  })
}

export default Service;
