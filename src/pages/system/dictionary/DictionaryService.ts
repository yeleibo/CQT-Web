import {
  Dictionary,
  DictionaryItem,
  DictionaryQueryParam,
} from '@/pages/system/dictionary/typings';
import SystemConst from '@/utils/const';
import { request } from '@@/exports';

const DictionaryService = {
  //全部字典项
  all: () =>
    request<Dictionary[]>(`/${SystemConst.API_BASE}/dictionaries`, {
      method: 'GET',
    }),
  //具体字典项
  dictionaryItems: (params: DictionaryQueryParam) =>
    request<DictionaryItem[]>(`/${SystemConst.API_BASE}/dictionary-items`, {
      method: 'GET',
      params,
    }),
  //获取字典的具体配置
  // dictionaryItemTree: (params: DictionaryQueryParam) =>
  //   request<DictionaryItem[]>(`/${SystemConst.API_BASE}/dictionary-items`, {
  //     method: 'GET',
  //     params,
  //   }).then((dictionaryItems: DictionaryItem[]) => {
  //     return mapToTreeDataType(
  //       dictionaryItems.map((item) => {
  //         return {
  //           id: item.id,
  //           key: item.id,
  //           value: item.name,
  //           parentId: item.parentId,
  //           title: item.name,
  //         };
  //       }),
  //     );
  //   }),

  //新建
  add: (data: DictionaryItem) =>
    request(`/${SystemConst.API_BASE}/dictionary-items`, {
      method: 'POST',
      data,
    }),
  //修改
  edit: (data: DictionaryItem) =>
    request(`/${SystemConst.API_BASE}/dictionary-items`, {
      method: 'PUT',
      data,
    }),
  //删除
  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/dictionary-items/${id}`, {
      method: 'DELETE',
    }),
};

export default DictionaryService;
