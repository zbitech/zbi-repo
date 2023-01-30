import { interfaces } from "inversify";
import { RoleType, VolumeType, VolumeSourceType, ResourceType, StatusType, NetworkType, NodeType, UserStatusType, InviteStatusType, SnapshotScheduleType, FilterConditionType, ProjectFilterType, InstanceFilterType, TeamFilterType } from "./zbi.enum";


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
    age?: string;
    role?: RoleType;
    status?: InviteStatusType;
}

export interface Team {
    id: string;
    name: string;
    owner?: User;
    members?: Array<TeamMember>;
}

export interface TeamMembership {
    teamId: string;
    teamName: string;
    memberId: string;
    memberRole: RoleType;
    status: InviteStatusType;
    permissions: string[];
};

export interface ResourceRequest {
    volumeType: VolumeType;
    volumeSize: string;
    volumeSourceType: VolumeSourceType;
    volumeSource?: string;
    volumeSourceProject?: string;
    cpu?: string;
    memory?: string;
    peers?: Array<string>;
    properties: Map<string, string>;
}

export interface KubernetesResource {
    id?: string;
    name: string;
    type: ResourceType;
    status: StatusType;
    properties: {};
}

export interface KubernetesResources {
    configmap?: KubernetesResource,
    secret?: KubernetesResource,
    persistentvolumeclaim?: KubernetesResource,
    deployment?: KubernetesResource,
    service?: KubernetesResource,
    httpproxy?: KubernetesResource,

    resources?: KubernetesResource[];
    volumesnapshot?: KubernetesResource[];
    snapshotschedule?: KubernetesResource;
}

export interface Project {
    id?: string;
    name: string;
    owner: User;
    team: Team;
    network: NetworkType;
    status: StatusType;
    description: string;
}

export interface ProjectRequest {
    name: string;
    team: string;
    network: NetworkType;
    description: string;
}

export interface Instance {
    id?: string;
    name: string;
    type: NodeType;
    project: string;
    description: string;
    request: ResourceRequest;
    status: StatusType;
}

export interface InstanceRequest {
    name: string;
    type: NodeType;
    description: string;
    request: ResourceRequest;
}

export interface SnapshotScheduleRequest {
    schedule: SnapshotScheduleType;
    hourOfDay?: number;
    dayOfWeek?: number;
    dayOfMonth?: number;
}

export interface QueryFilter {
    param: ProjectFilterType | InstanceFilterType | TeamFilterType;
    condition: FilterConditionType;
    value: string;
    page: number;
    itemsPerPage: number;
}