import { OrganizeItem, OrganizeTreeData } from '@/pages/organize-manage/organize/OrganizeTypings';
import SystemConst from '@/utils/const';
import { request } from '@umijs/max';

const OrganizeService = {
  //所有部门
  all: () =>
    request<OrganizeItem[]>(`/${SystemConst.API_BASE}/organizes`, {
      method: 'GET',
    }),
  add: (data: OrganizeItem) =>
    request(`/${SystemConst.API_BASE}/organizes`, {
      method: 'POST',
      data,
    }),
  edit: (id: number, data: OrganizeItem) =>
    request(`/${SystemConst.API_BASE}/organizes/${id}`, {
      method: 'PUT',
      data,
    }),
  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/organizes/${id}`, {
      method: 'DELETE',
    }),
  tree: () =>
    request<OrganizeItem[]>(`/${SystemConst.API_BASE}/organizes`, {
      method: 'GET',
    }).then((organizes: any[]) => {
      return OrganizeTreeData(organizes);
    }),
};

export default OrganizeService;
