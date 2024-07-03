import {
  InventoryTransferGoodDetail,
  InventoryTransferQueryParam,
} from '@/pages/inventory/transfer/type';
import SystemConst from '@/utils/const';
import { request } from '@@/exports';
import qs from 'qs';

const TransferService = {
  list: (params: InventoryTransferQueryParam) =>
    request(`/${SystemConst.API_BASE}/inventory-transfers`, {
      method: 'GET',
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),
  //获取执行物资
  getGoods: (id: number) =>
    request<InventoryTransferGoodDetail[]>(
      `/${SystemConst.API_BASE}/inventory-transfers/${id}/goods`,
      {
        method: 'GET',
      },
    ),

  getGoodExcel: (params: InventoryTransferQueryParam) =>
    request(`/${SystemConst.API_BASE}/inventory-transfers/goods-excel`, {
      method: 'GET',
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    }),

  //提交执行物资
  execute: (id: number, inventoryGoods: InventoryTransferGoodDetail[]) =>
    request(`/${SystemConst.API_BASE}/inventory-transfers/${id}/execute`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // 确保请求体的类型为 JSON
      },
      body: JSON.stringify(inventoryGoods),
    }),
  //删除
  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/inventory-transfers/${id}`, {
      method: 'DELETE',
    }),
  //报废
  scrapInventoryTransfer: (id: number) =>
    request(`/${SystemConst.API_BASE}/inventory-ins/${id}/scrap`, {
      method: 'PUT',
    }),
};

export default TransferService;
