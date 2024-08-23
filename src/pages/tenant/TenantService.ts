import { Tenant, TenantParams } from '@/pages/tenant/type';
import SystemConst from '@/utils/const';
import { request } from '@@/exports';
import qs from 'qs';

const TenantService = {
  list: (params?: TenantParams) =>
    request(`/${SystemConst.API_BASE}/tenant`, {
      method: 'GET',
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),

  add: (tenant: Tenant) =>
    request(`/${SystemConst.API_BASE}/tenant`, {
      method: 'POST',
      data: tenant,
    }),

  update: (tenant: Tenant) =>
    request(`/${SystemConst.API_BASE}/tenant`, {
      method: 'PUT',
      data: tenant,
    }),

  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/tenant/${id}`, {
      method: 'DELETE',
    }),
};

export default TenantService;
