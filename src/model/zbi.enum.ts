
enum RoleType {
    admin = 'admin',
    user = 'user',
    owner = 'owner'
}

enum NetworkType {
    testnet = 'testnet',
    regnet = 'regnet',
    mainnet = 'mainnet'
}

enum NodeType {
    zcash = 'zcash',
    lwd = 'lwd',
    zebra = 'zebra'
}

enum VolumeType {
    ephemeral = 'ephemeral',
    persistentvolumeclaim = 'persistentvolumeclaim'
}

enum VolumeSourceType {
    new = 'new',
    volume = 'pvc',
    snapshot = 'snapshot'
}

enum ResourceType {
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

enum StatusType {
    pending = 'pending',
    runnning = 'running',
    stopped = 'stopped',
    created = 'created',
    bound = 'bound',
    failed = 'failed',
    active = 'active',
    deleted = 'deleted',
}

enum SnapshotScheduleType {
    daily = 'daily',
    weekly = 'weekly',
    monthly = 'monthly'
}