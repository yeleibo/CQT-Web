import { request } from '@@/exports';
import SystemConst from '@/utils/const';


const GeoJsonService = {
  getGeoJson:  () => request(`/${SystemConst.API_BASE}/geo-json`, {
    method: 'GET',
  }),
}

export default GeoJsonService;
