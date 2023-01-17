import { RoleType, VolumeType, VolumeSourceType, ResourceType, StatusType, NetworkType, NodeType } from "./zbi.enum";


export interface User {
    userName: string;
    email: string;
    name: string;
    role?: RoleType;
}

export interface TeamMember {
    user: User;
    age: string;
}

export interface Team {
    teamId: string;
    teamName: string;
    owner: User;
    members: Array<TeamMember>;
}

export interface TeamInfo {
    teamId: string;
    name: string;
    owner: String;
}

export interface ResourceRequest {
    volumeType: VolumeType;
    volumeSize: string;
    volumeSourceType: VolumeSourceType;
    volumeSource: string;
    volumeSourceProject: string;
    cpu: string;
    memory: string;
    peers: Array<string>;
}

export interface KubernetesResource {
    name: string;
    type: ResourceType;
    status: StatusType;
    properties: {};
}

export interface Project {
    name: string;
    owner: User;
    team: TeamInfo;
    network: NetworkType;
    status: StatusType;
    description: string;
}

export interface Instance {
    name: string;
    type: NodeType;
    description: string;
    request: ResourceRequest;
    resources: Array<KubernetesResource>;
}