import { RoleType, VolumeType, VolumeSourceType, ResourceType, StatusType, NetworkType, NodeType, UserStatusType } from "./zbi.enum";


export interface User {
    userId?: string;
    userName: string;
    email: string;
    name: string;
    role?: RoleType;
    status?: UserStatusType;
}

export interface TeamMember {
    user: User;
    age: string;
    role?: RoleType;
}

export interface Team {
    id: string;
    name: string;
    owner?: User;
    members?: Array<TeamMember>;
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
    team: Team;
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