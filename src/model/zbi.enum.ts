
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
}

export enum SnapshotScheduleType {
    daily = 'daily',
    weekly = 'weekly',
    monthly = 'monthly'
}