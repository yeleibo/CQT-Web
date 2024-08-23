import { OrganizeItem, OrganizeTreeData } from '@/pages/organize-manage/organize/OrganizeTypings';
import SystemConst from '@/utils/const';
import { request } from '@umijs/max';

const OrganizeService = {
  //所有部门
  all: () =>
    request<OrganizeItem[]>(`/${SystemConst.API_BASE}/organize`, {
      method: 'GET',
    }),
  add: (data: OrganizeItem) =>
    request(`/${SystemConst.API_BASE}/organize`, {
      method: 'POST',
      data,
    }),
  edit: (id: number, data: OrganizeItem) =>
    request(`/${SystemConst.API_BASE}/organize/${id}`, {
      method: 'PUT',
      data,
    }),
  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/organize/${id}`, {
      method: 'DELETE',
    }),
  tree: () =>
    request<OrganizeItem[]>(`/${SystemConst.API_BASE}/organize`, {
      method: 'GET',
    }).then((organizes: any[]) => {
      return OrganizeTreeData(organizes);
    }),
};

export default OrganizeService;
