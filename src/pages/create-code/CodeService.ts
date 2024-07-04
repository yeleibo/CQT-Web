import SystemConst from '@/utils/const';
import { request } from '@umijs/max';
import {CodeCreateDto1, CodeCreateResultDto} from "@/pages/create-code/codeType";

const CodeService={
  createCodes: (dto:CodeCreateDto1)=>request<CodeCreateResultDto[]>(`/${SystemConst.API_BASE}/chaoqian/create-codes`, {
    method: 'POST',
   
    data:dto,
  })
}

export default CodeService;
