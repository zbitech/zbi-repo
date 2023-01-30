
export enum RoleType {
    admin = 'admin',
    user = 'user',
    owner = 'owner'
}

export enum InviteStatusType {
    pending = 'pending',
    accepted = 'accepted',
    rejected = 'rejected'
}

export enum NetworkType {
    testnet = 'testnet',
    regnet = 'regnet',
    mainnet = 'mainnet'
}

export enum NodeType {
    zcash = 'zcash',
    lwd = 'lwd',
    zebra = 'zebra'
}

export enum VolumeType {
    ephemeral = 'ephemeral',
    persistentvolumeclaim = 'persistentvolumeclaim'
}

export enum VolumeSourceType {
    new = 'new',
    volume = 'pvc',
    snapshot = 'snapshot'
}

export enum ResourceType {
    namespace = 'namespace',
    configmap = 'configmap',
    secret = 'secret',
    persistentvolumeclaim = 'persistentvolumeclaim',
    deployment = 'deployment',
    service = 'service',
    httpproxy = 'httpproxy',
    volumesnapshot = 'volumesnapshot',
    snapshotschedule = 'snapshotschedule',
    pod = 'pod'
}

export enum UserStatusType {
    invited = 'invited',
    active = 'active',
    inactive = 'inactive'
}

export enum StatusType {
    pending = 'pending',
    runnning = 'running',
    stopped = 'stopped',
    created = 'created',
    bound = 'bound',
    failed = 'failed',
    active = 'active',
    deleted = 'deleted',
    new = 'new'
}

export enum SnapshotScheduleType {
    daily = 'daily',
    weekly = 'weekly',
    monthly = 'monthly'
}

export enum ProjectFilterType {
    name = "name",
    network = "network",
    owner = "owner",
    team = "team",
    status = "status"
}

export enum InstanceFilterType {
    name = "name",
    type = "type",
    project = "project"
}

export enum TeamFilterType {
    name = "name",
    owner = "owner",
    status = "status"
}

export enum FilterConditionType {
    equal = "equal",
    notequal = "notequal",
    in = "in",
    notin = "notin",
    like = "like",
    notlike = "notlike"
}

// export type ProjectFilter = "name" | "network" | "owner" | "team" | "status";
// export type InstanceFilter = "name" | "type" | "project";
// export type TeamFilter = "name" | "owner" 
// export type FilterCondition = "eq" | "neq" | "in" | "nin" | "like" | "nlike";