import { request } from '@umijs/max';
import SystemConst from '@/utils/const';
import { SystemConfig } from '@/pages/system/commonSystemConfig/type';

const SystemService = {
  async configs() {
    return request<any>(`/${SystemConst.API_BASE}/system/configs`, {
      method: 'GET',
    });
  },
  async menus() {
    return request<any>(`/${SystemConst.API_BASE}/system/menus`, {
      method: 'GET',
    });
  },
  async getConfigList() {
    return request<any>(`/${SystemConst.API_BASE}/system`, {
      method: 'GET',
    });
  },
  async updateConfig(data: SystemConfig) {
    return request<any>(`/${SystemConst.API_BASE}/system`, {
      method: 'PUT',
      data,
    });
  },
  async delete(id: number) {
    return request(`/${SystemConst.API_BASE}/${id}`, {
      method: 'DELETE',
    });
  },
};

export default SystemService;
