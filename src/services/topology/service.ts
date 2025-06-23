import { ChaoqianTopologyDto } from "@/models/chaoqian";
import { request } from "@umijs/max";


const TopologyService = {
    getTopology:  (boxId?: number, areaId?: boolean) => request<ChaoqianTopologyDto>('/api/window/chaoqian/topology', {
        method: 'GET',
        params: {
            boxId,
            areaId
        }
    })
}

export default TopologyService;