import { SystemConfig } from '@/pages/system/commonSystemConfig/type';
import { request } from '@umijs/max';

const SysConfigService = {
  async list() {
    return request<SystemConfig[]>('/api/window/system-config', {
      method: 'GET',
    });
  },
  async add(data: SystemConfig) {
    return request('/api/window/system-config', {
      method: 'POST',
      data,
    });
  },

  async update(data: SystemConfig) {
    return request('/api/window/system-config', {
      method: 'PUT',
      data,
    });
  },
  async delete(id: number) {
    return request(`/api/window/system-config/${id}`, {
      method: 'DELETE',
    });
  },
};

export default SysConfigService;
