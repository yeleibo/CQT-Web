import {AreaStatisticsQueryParam,AreaDto} from "@/pages/project/type";
import {request} from "@umijs/max";
import SystemConst from "@/utils/const";

const AreaService = {
  getAreaStatistics: (params: AreaStatisticsQueryParam) => request(`/${SystemConst.API_BASE}/areas`, {
    method: 'GET',

    params
  }),

  addAreaStatistics:(areaDto:AreaDto) => request(`/${SystemConst.API_BASE}/areas`, {
    method: 'POST',
    data:areaDto
  }),

  updateAreaStatistics:(area: AreaDto) => request(`/${SystemConst.API_BASE}/areas`, {
    method: 'PUT',
    data:area
  }),
  deleteAreaStatistics:(id: number) => request(`/${SystemConst.API_BASE}/areas/${id}`, {
    method: 'DELETE',
  })
}

export default AreaService;
