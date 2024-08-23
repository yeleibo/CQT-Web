import { Permission, Role, RolesQueryParam } from '@/pages/organize-manage/role/RoleTypings';
import SystemConst from '@/utils/const';
import { request } from '@@/exports';
import qs from 'qs';

const RoleService = {
  all: (params: RolesQueryParam) =>
    request(`/${SystemConst.API_BASE}/role`, {
      method: 'GET',
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),
  add: (data: Role) =>
    request(`/${SystemConst.API_BASE}/role`, {
      method: 'POST',
      data,
    }),
  edit: (data: Role) =>
    request(`/${SystemConst.API_BASE}/role`, {
      method: 'PUT',
      data,
    }),
  editUsers: (id: number, data: number[]) =>
    request(`/${SystemConst.API_BASE}/role/${id}/users`, {
      method: 'PUT',
      data,
    }),
  editPermissions: (id: number, data: number[]) =>
    request(`/${SystemConst.API_BASE}/role/${id}/permissions`, {
      method: 'PUT',
      data,
    }),
  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/role/${id}`, {
      method: 'DELETE',
    }),
  allPermissions: () =>
    request<Permission[]>(`/${SystemConst.API_BASE}/permission`, {
      method: 'GET',
    }),
};

export default RoleService;
