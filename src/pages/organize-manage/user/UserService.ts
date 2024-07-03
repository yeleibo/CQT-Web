import {
  SendNotificationParam,
  UserItem,
  UsersQueryParam,
} from '@/pages/organize-manage/user/UserTypings';
import SystemConst from '@/utils/const';
import { request } from '@@/exports';
import qs from 'qs';

const UserService = {
  all: (params?: UsersQueryParam) =>
    request<UserItem[]>(`/${SystemConst.API_BASE}/users`, {
      method: 'GET',
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),
  // tree: () =>
  //   request<BaseOptionType[]>(`/${SystemConst.API_BASE}/users`, {
  //     method: 'GET',
  //   }),
  add: (data: UserItem) =>
    request(`/${SystemConst.API_BASE}/users`, {
      method: 'POST',
      data,
    }),
  edit: (data: UserItem) =>
    request(`/${SystemConst.API_BASE}/users`, {
      method: 'PUT',
      data,
    }),
  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/users/${id}`, {
      method: 'DELETE',
    }),
  resetPassWord: (id: number) =>
    request(`/${SystemConst.API_BASE}/users/${id}/reset-password`, {
      method: 'PUT',
    }),
  sendNotification: (params: SendNotificationParam) =>
    request(`/${SystemConst.API_BASE}/users/send-notification`, {
      method: 'GET',
      params,
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),
  clearDeviceId: (id: number) =>
    request(`/${SystemConst.API_BASE}/users/${id}/clear-device-id`, {
      method: 'PUT',
    }),
  userManagementOrganizes: (id: number, data: number[]) =>
    request(`/${SystemConst.API_BASE}/users/${id}/management-organizes`, {
      method: 'PUT',
      data,
    }),
  UserManagementInventoryHouses: (id: number, data: number[]) =>
    request(`/${SystemConst.API_BASE}/users/${id}/management-inventory-houses`, {
      method: 'PUT',
      data,
    }),
};

export default UserService;
