import {request} from "@umijs/max";
import SystemConst from "@/utils/const";

const Service={
   login:(data:LoginParam)=> request(`/${SystemConst.API_BASE}/account/login`, {
    method: 'POST',
    data,
  }),
  me: ()=> request<UserInfo>(`/${SystemConst.API_BASE}/users/me`, {
    method: 'GET',
  }),
  changePassword:(password:string)=>request(`/${SystemConst.API_BASE}/account/change-password`,{
      method: 'GET',
      password,
    }),
}

export default Service;
