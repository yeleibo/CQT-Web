import { ISP, ISPParams } from '@/pages/isp/type';
import SystemConst from '@/utils/const';
import { request } from '@@/exports';
import qs from 'qs';

const ISPService = {
  list: (params?: ISPParams) =>
    request(`/${SystemConst.API_BASE}/isp`, {
      method: 'GET',
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),

  add: (isp: ISP) =>
    request(`/${SystemConst.API_BASE}/isp`, {
      method: 'POST',
      data: isp,
    }),

  update: (isp: ISP) =>
    request(`/${SystemConst.API_BASE}/isp`, {
      method: 'PUT',
      data: isp,
    }),

  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/isp/${id}`, {
      method: 'DELETE',
    }),
};

export default ISPService;
