import {request} from "@umijs/max";
import SystemConst from "@/utils/const";
import {InventoryInvoiceQueryParam} from "@/pages/inventory/invoice/type";
import qs from "qs";


const InvoiceService = {
  getInventoryInvoiceRequest:(params:InventoryInvoiceQueryParam)=> request(`/${SystemConst.API_BASE}/inventory-invoices`, {
    method: 'GET',
    params,
    paramsSerializer:(params)=>{
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  }),

  getGoodsExcel:(params:InventoryInvoiceQueryParam)=>request(`/${SystemConst.API_BASE}/inventory-invoices/goods-excel`, {
    method: 'GET',
    params,
    paramsSerializer:(params)=>{
      return qs.stringify(params, { arrayFormat: 'repeat' });
    }
  }),

  delete:(id:number)=>request(`/${SystemConst.API_BASE}/inventory-invoices/${id}`,{
    method: 'DELETE',
  })
}

export default InvoiceService;
