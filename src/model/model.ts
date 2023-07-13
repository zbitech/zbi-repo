import { interfaces } from "inversify";
import { RoleType, VolumeType, VolumeSourceType, ResourceType, StatusType, NetworkType, 
        NodeType, UserStatusType, InviteStatusType, SnapshotScheduleType, FilterConditionType, 
        ProjectFilterType, InstanceFilterType, TeamFilterType, UserFilterType, LoginProvider, StateType } from "./zbi.enum";
import { JobStatus } from "bull";


export interface AuthRequest {
    email?: string;
    password?: string;
    code?: string;
}

export interface AuthResult {
    email?: string;
    valid: boolean;
    registered: boolean;
    accessToken?: string;
    refreshToken?: string;
    user?: any;
}

export interface RegisterRequest {
    email: string;
    name?: string;
    password?: string;
    acceptedTerms: boolean;
}

export interface RegisterResult {

}

export interface Registration {
    acceptedTerms: boolean;
    provider: LoginProvider;
    created: string;
}

export interface User {
    userid?: string;
    email: string;
    name: string;
    role?: RoleType;
    status?: UserStatusType;
    created?: string;
    updated?: string;
    last_ip?: string;
    last_login?: string;
    logins_count?: string;
    password?: string;
}

export interface Subject {
    email: string;
    name: string;
    role: string;

}



export interface UserInfo {
    userid: string;
    email: string;   
    username: string;
    created: string;
    updated: string;
    name: string;
    last_ip: string;
    last_login: string;
    logins_count: string;
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
    cpu?: string;
    memory?: string;
    peers?: Array<string>;
    volume?: VolumeRequest;
    properties?: Map<string, any>;
}

export interface KubernetesResource {
    id?: string;
    name: string;
    type: ResourceType;
    status: StatusType;
    properties: Map<String, Object>;
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
    owner?: string;
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
    state: StateType;
}

export interface InstanceRequest {
    name: string;
    type: NodeType;
    description: string;
    peers?: Array<string>;
    volume?: {
        type: VolumeType;
        size?: string;
        source: VolumeSourceType;
        instance?: string;
        project?: string;    
    }
}

export interface VolumeRequest {
    type: VolumeType;
    size?: string;
    source: VolumeSourceType;
    instance?: string;
    project?: string;
}

export interface SnapshotScheduleRequest {
    schedule: SnapshotScheduleType;
    hourOfDay?: number;
    dayOfWeek?: number;
    dayOfMonth?: number;
}

export interface QueryParam {
    name?: UserFilterType | ProjectFilterType | InstanceFilterType | TeamFilterType;
    condition?: FilterConditionType;
    value?: any;
}

export interface QueryFilter {
    name: UserFilterType | ProjectFilterType | InstanceFilterType | TeamFilterType | JobStatus;
    condition: FilterConditionType;
    value: string;
    page: number;
    itemsPerPage: number;
}

export interface Job {
    id: string;
    created: string;
    name: string;
    active: boolean;
    completed: boolean;
    delayed: boolean;
    failed: boolean;
    waiting: boolean;
    finishedOn: number;
    failedReason: string;
}