import {
  InventoryEngineeringTransferGoodDetail,
  InventoryEngineeringTransfersQueryParam,
} from '@/pages/inventory/engineering-transfer/type';
import SystemConst from '@/utils/const';
import { request } from '@@/exports';
import qs from 'qs';

const EngineeringTransferService = {
  list: (params: InventoryEngineeringTransfersQueryParam) =>
    request(`/${SystemConst.API_BASE}/inventory-engineering-transfers`, {
      method: 'GET',
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),

  getGoodExcel: (params: InventoryEngineeringTransfersQueryParam) =>
    request(`/${SystemConst.API_BASE}/inventory-engineering-transfers/goods-excel`, {
      method: 'GET',
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),
  //获取执行物资
  getGoods: (id: number) =>
    request<InventoryEngineeringTransferGoodDetail[]>(
      `/${SystemConst.API_BASE}/inventory-engineering-transfers/${id}/goods`,
      {
        method: 'GET',
      },
    ),

  //提交执行物资
  execute: (id: number, inventoryGoods: InventoryEngineeringTransferGoodDetail[]) =>
    request(`/${SystemConst.API_BASE}/inventory-engineering-transfers/${id}/execute`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // 确保请求体的类型为 JSON
      },
      body: JSON.stringify(inventoryGoods),
    }),
  //删除
  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/inventory-engineering-transfers/${id}`, {
      method: 'DELETE',
    }),
};

export default EngineeringTransferService;
