import { CodeCreateDto1, CodeCreateResultDto, CodeOrder } from '@/pages/create-code/codeType';
import SystemConst from '@/utils/const';
import { request } from '@umijs/max';

const CodeService = {
  createCodes: (dto: CodeCreateDto1) =>
    request<CodeCreateResultDto[]>(`/${SystemConst.API_BASE}/chaoqian/create-codes`, {
      method: 'POST',
      data: dto,
    }),

  codeOrderAdd: (dto: CodeOrder) =>
    request(`/${SystemConst.API_BASE}/code-order`, {
      method: 'POST',
      data: dto,
    }),

  updateCode: (dto: CodeOrder) =>
    request(`/${SystemConst.API_BASE}/code-order`, {
      method: 'PUT',
      data: dto,
    }),
};

export default CodeService;
