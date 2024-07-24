import { ChaoqianTopologyDto, ChaoqianTopologyParam } from '@/pages/topology/type';
import SystemConst from '@/utils/const';
import { request } from '@umijs/max';

const ChaoqianService = {
  getChaoqianTopology: (params: ChaoqianTopologyParam) =>
    request<ChaoqianTopologyDto>(`/${SystemConst.API_BASE}/chaoqian/topology`, {
      method: 'GET',
      params,
    }),
};

export default ChaoqianService;
