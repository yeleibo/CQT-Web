import { PageParams } from '@/models/page';
import SystemConst from '@/utils/const';
import { request } from '@@/exports';
import qs from 'qs';

const DesignableService = {
  //全部
  all: (params?: DesignableQueryParam) =>
    request<[]>(`/${SystemConst.API_BASE}/dictionary-items`, {
      method: 'GET',
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),
  //新建
  add: (data: unknown) =>
    request(`/${SystemConst.API_BASE}/dictionary-items`, {
      method: 'POST',
      data,
    }),
  //修改
  edit: (data: unknown) =>
    request(`/${SystemConst.API_BASE}/dictionary-items`, {
      method: 'PUT',
      data,
    }),
  //删除
  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/dictionary-items/${id}`, {
      method: 'DELETE',
    }),
};

export default DesignableService;

export type DesignableQueryParam = PageParams & {
  keyword?: string;
};
