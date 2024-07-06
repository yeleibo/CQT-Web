import { ChaoqianTopologyParam } from '@/pages/topology/type';
import SystemConst from '@/utils/const';
import { request } from '@umijs/max';

const chaoqianService = {
  getChaoqianTopology: (params: ChaoqianTopologyParam) =>
    request(`/${SystemConst.API_BASE}/chaoqian/topology`, {
      method: 'GET',
      params,
    }),
};

export default chaoqianService;
