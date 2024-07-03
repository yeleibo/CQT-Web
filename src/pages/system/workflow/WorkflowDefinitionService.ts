import {
  WorkflowDefinitionExtendInfo,
  WorkflowDefinitionExtendInfosQueryParam,
} from '@/pages/system/workflow/typings';
import SystemConst from '@/utils/const';
import { request } from '@umijs/max';
import qs from 'qs';

const WorkflowDefinitionService = {
  //所有部门
  all: (params?: WorkflowDefinitionExtendInfosQueryParam) =>
    request<WorkflowDefinitionExtendInfo[]>(
      `/${SystemConst.API_BASE}/workflow-definition-extend-infos`,
      {
        method: 'GET',
        params,
        paramsSerializer: function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        },
      },
    ),
  add: (data: WorkflowDefinitionExtendInfo) =>
    request(`/${SystemConst.API_BASE}/workflow-definition-extend-infos`, {
      method: 'POST',
      data,
    }),
  edit: (data: WorkflowDefinitionExtendInfo) =>
    request(`/${SystemConst.API_BASE}/workflow-definition-extend-infos`, {
      method: 'PUT',
      data,
    }),
  delete: (id: number) =>
    request(`/${SystemConst.API_BASE}/workflow-definition-extend-infos/${id}`, {
      method: 'DELETE',
    }),
};

export default WorkflowDefinitionService;
