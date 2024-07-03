import { InventoryOutGoodDetail, InventoryOutQueryParam } from '@/pages/inventory/out/type';
import SystemConst from '@/utils/const';
import { request } from '@@/exports';
import qs from 'qs';

const InventoryOutService = {
  list: (params: InventoryOutQueryParam) =>
    request(`/${SystemConst.API_BASE}/inventory-outs`, {
      method: 'GET',
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),

  getGoodExcel: (params: InventoryOutQueryParam) =>
    request(`/${SystemConst.API_BASE}/inventory-outs/goods-excel`, {
      method: 'GET',
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),

  //获取执行物资
  getGoods: (id: number) =>
    request<InventoryOutGoodDetail[]>(`/${SystemConst.API_BASE}/inventory-outs/${id}/goods`, {
      method: 'GET',
    }),

  //提交执行物资
  execute: (id: number, inventoryGoods: InventoryOutGoodDetail[]) =>
    request(`/${SystemConst.API_BASE}/inventory-outs/${id}/execute`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // 确保请求体的类型为 JSON
      },
      body: JSON.stringify(inventoryGoods),
    }),
  //删除
  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/inventory-outs/${id}`, {
      method: 'DELETE',
    }),
  //报废
  scrapInventoryOut: (id: number) =>
    request(`/${SystemConst.API_BASE}/inventory-outs/${id}/scrap`, {
      method: 'PUT',
    }),
};

export default InventoryOutService;
