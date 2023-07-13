import { ResourceRequest, VolumeRequest } from "../model/model";
import { NodeType, VolumeSourceType, VolumeType } from "../model/zbi.enum";

export function createResourceRequest (type: NodeType, dataVolumeType: VolumeType, dataSourceType: VolumeSourceType, dataSource: string, project: string, peers: string[]): ResourceRequest {

    let volume: VolumeRequest = {type: dataVolumeType, source: dataSourceType, instance: dataSource, project};
    let dataVolumeSize: string;
    let properties: Map<string, string> = new Map<string, string>();

    if(type === NodeType.zcash) {
        volume.size = "15Gi";
    } else {
        volume.size = "15Gi";
    }

    return {
        peers,
        properties,
        volume
    }

}