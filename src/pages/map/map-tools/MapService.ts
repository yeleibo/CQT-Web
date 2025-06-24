import {request} from "@@/exports";
import qs from "qs";
import SystemConst from '@/utils/const';

const MapTestService = {
  //所有部门
  getAll: (params?: {la:number,lo:number}) =>
    request<[]>(`/${SystemConst.API_BASE}/organizes`, {
      method: 'GET',
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),
};

export default MapTestService;
