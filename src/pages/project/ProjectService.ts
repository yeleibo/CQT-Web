import { ProjectDto, ProjectStatisticsQueryParam, ResourceData } from '@/pages/project/type';
import {request} from "@umijs/max";
import SystemConst from "@/utils/const";

const ProjectService = {
  getProjectList: (params: ProjectStatisticsQueryParam) => request<ProjectDto[]>(`/${SystemConst.API_BASE}/projects`, {
    method: 'GET',
    params
  }),

  getProjectDetail: (id: number) => request<ProjectDto>(`/${SystemConst.API_BASE}/projects/${id}`, {
    method: 'GET',
  }),

  getProjectStatistics: (id: number) => request<ResourceData>(`/${SystemConst.API_BASE}/projects/statistics/${id}`, {
    method: 'GET',
  }),

  addProjectStatistics:(areaDto:ProjectDto) => request(`/${SystemConst.API_BASE}/projects`, {
    method: 'POST',
    data:areaDto
  }),

  updateProjectStatistics:(area: ProjectDto) => request(`/${SystemConst.API_BASE}/projects`, {
    method: 'PUT',
    data:area
  }),
  deleteProjectStatistics:(id: number) => request(`/${SystemConst.API_BASE}/projects/${id}`, {
    method: 'DELETE',
  })
}

export default ProjectService;

