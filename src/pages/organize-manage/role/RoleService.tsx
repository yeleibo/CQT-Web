import { Permission, Role, RolesQueryParam } from '@/pages/organize-manage/role/RoleTypings';
import SystemConst from '@/utils/const';
import { request } from '@@/exports';
import qs from 'qs';

const RoleService = {
  all: (params: RolesQueryParam) =>
    request(`/${SystemConst.API_BASE}/roles`, {
      method: 'GET',
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),
  add: (data: Role) =>
    request(`/${SystemConst.API_BASE}/roles`, {
      method: 'POST',
      data,
    }),
  edit: (data: Role) =>
    request(`/${SystemConst.API_BASE}/roles`, {
      method: 'PUT',
      data,
    }),
  editUsers: (id: number, data: number[]) =>
    request(`/${SystemConst.API_BASE}/roles/${id}/users`, {
      method: 'PUT',
      data,
    }),
  editPermissions: (id: number, data: number[]) =>
    request(`/${SystemConst.API_BASE}/roles/${id}/permissions`, {
      method: 'PUT',
      data,
    }),
  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/roles/${id}`, {
      method: 'DELETE',
    }),
  allPermissions: () =>
    request<Permission[]>(`/${SystemConst.API_BASE}/permissions`, {
      method: 'GET',
    }),
};

export default RoleService;
