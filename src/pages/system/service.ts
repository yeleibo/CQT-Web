import { request } from '@umijs/max';
import SystemConst from '@/utils/const';

const SystemService = {
  async configs() {
    return request<any>(`/${SystemConst.API_BASE}/system/configs`, {
      method: 'GET',
    });
  },
};

export default SystemService;
