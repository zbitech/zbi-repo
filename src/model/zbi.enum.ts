
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
    persistentvolumeclaim = 'pvc'
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

export enum StateType {
    new = "new",
    running = "running",
    stopped = "stopped",
    starting = "starting",
    stopping = "stopping",
    deleting = "deleting",
    deleted = "deleted",

    pending = "pending"
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

export enum UserFilterType {
    userid = "userid",
    role = "role",
    status = "status",
    email = "email"
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

export enum LoginProvider {
    local = "local",
    google = "google",
}

export enum Permission {
    create = "create",
    read = "read",
    update = "update",
    delete = "delete"
}

export enum Action {
    user = "user",
    team = "team",
    project = "project",
    resource = "resource"
}

export enum UserPermissions {
    create = "create:user",
    read = "read:user",
    update = "update:user",
    delete = "delete:user"
}

export enum TeamPermissions {
    create = "create:team",
    read = "read:team",
    update = "update:team",
    delete = "delete:team"
}

export enum ProjectPermissions {
    create = "create:project",
    read = "read:project",
    update = "update:project",
    delete = "delete:project"
}

export enum InstancePermissions {
    create = "create:instance",
    read = "read:instance",
    update = "update:instance",
    delete = "delete:instance"
}

export enum ResourcePermissions {
    create = "create:resource",
    read = "read:resource",
    update = "update:resource",
    delete = "delete:resource"
}
