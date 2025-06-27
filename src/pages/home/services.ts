import { request } from '@umijs/max';
import {ResourceStatic} from "@/pages/home/DataModel";
import SystemConst from '@/utils/const';

const DataVisualizationRepository = {
  getResource: async (projectId?: number) =>
    request<ResourceStatic[]>(`/${SystemConst.API_BASE}/data-visualization/resource`, {
      method: 'GET',
      params: { projectId }
    }),
};

export default  DataVisualizationRepository;
