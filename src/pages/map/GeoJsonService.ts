import { request } from '@@/exports';
import SystemConst from '@/utils/const';


const GeoJsonService = {
  getGeoJson:  () => request(`/${SystemConst.API_BASE}/geo-json`, {
    method: 'GET',
  }),
  getGeoJsonOfProject:  (id:number) => request(`/${SystemConst.API_BASE}/geo-json/project/${id}`, {
    method: 'GET',
  }),
}

export default GeoJsonService;
