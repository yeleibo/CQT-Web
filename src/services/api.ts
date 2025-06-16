import { ChaoqianTopologyDto } from '@/store/types';

// API基础地址，可以从环境变量中获取
const baseUrl = process.env.REACT_APP_API_BASE_URL || '';

// 请求拓扑数据的参数
interface TopologyParams {
  boxId?: number;
  customerId?: number;
}

/**
 * 获取超前拓扑数据
 */
export const fetchChaoqianTopology = async (params: TopologyParams): Promise<ChaoqianTopologyDto> => {
  const queryParams = new URLSearchParams();
  
  if (params.boxId) {
    queryParams.append('boxId', params.boxId.toString());
  }
  
  if (params.customerId) {
    queryParams.append('customerId', params.customerId.toString());
  }
  
  const response = await fetch(`${baseUrl}/api/chaoqian/topology?${queryParams.toString()}`);
  
  if (!response.ok) {
    throw new Error(`网络请求失败: ${response.status}`);
  }
  
  return await response.json() as ChaoqianTopologyDto;
};

/**
 * 获取文件URL
 */
export const getFileUrl = (url: string): string => {
  if (!url) return '';
  
  if (url.startsWith('http')) {
    return url;
  }
  
  return `${baseUrl}/api/files/${url}`;
};

/**
 * 获取文件二进制数据
 */
export const getFileBytes = async (url: string): Promise<ArrayBuffer> => {
  const fileUrl = getFileUrl(url);
  
  const response = await fetch(fileUrl);
  
  if (!response.ok) {
    throw new Error(`文件获取失败: ${response.status}`);
  }
  
  return await response.arrayBuffer();
};