import {
  InventoryRollbackGoodDetail,
  InventoryRollbackQueryParam,
} from '@/pages/inventory/rollback/type';
import SystemConst from '@/utils/const';
import { request } from '@@/exports';
import qs from 'qs';

const RollbackService = {
  list: (params: InventoryRollbackQueryParam) =>
    request(`/${SystemConst.API_BASE}/inventory-rollbacks`, {
      method: 'GET',
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),

  getGoodsExcel: (params: InventoryRollbackQueryParam) =>
    request(`/${SystemConst.API_BASE}/inventory-rollbacks/goods-excel`, {
      method: 'GET',
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),
  //获取执行物资
  getGoods: (id: number) =>
    request<InventoryRollbackGoodDetail[]>(
      `/${SystemConst.API_BASE}/inventory-rollbacks/${id}/goods`,
      {
        method: 'GET',
      },
    ),

  //提交执行物资
  execute: (id: number, inventoryGoods: InventoryRollbackGoodDetail[]) =>
    request(`/${SystemConst.API_BASE}/inventory-rollbacks/${id}/execute`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // 确保请求体的类型为 JSON
      },
      body: JSON.stringify(inventoryGoods),
    }),
  //删除
  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/inventory-rollbacks/${id}`, {
      method: 'DELETE',
    }),
};

export default RollbackService;
