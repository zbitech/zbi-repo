import { Instance, KubernetesResource, KubernetesResources, Project, QueryParams, SnapshotScheduleRequest, Team, User } from "./model/model";
import { ResourceType, SnapshotScheduleType, NetworkType, StatusType } from "./model/zbi.enum";
export interface Database {
    init(): Promise<void>;
    connect(): Promise<void>;
    close(): Promise<void>;
    clear(): Promise<void>;
}


export interface IAMRepository {
    createUser(user: User): Promise<User>;
    updateUser(user: User): Promise<User>;
    findUsers(params: {}, limit: number, skip: number): Promise<Array<User>>;
    findUser(params: {}): Promise<User>;
    resetUserPassword(userName: string): Promise<void>;
    activateUser(userName: string): Promise<void>;
    deactivateUser(userName: string): Promise<void>;
    validateAuth(type: string, value: string): Promise<boolean>;

    createTeam(ownerId: string, name: string): Promise<Team>;
    findTeams(limit: number, skip: number): Promise<Array<Team>>;
    findTeam(teamId: string): Promise<Team>;
    findTeamMemberships(userId: string): Promise<Array<Team>>
    removeTeamMembership(teamId: string, userId: string): Promise<Team>;
    addTeamMembership(teamId: string, userId: string): Promise<Team>;
    findPendingMemberships(): Promise<Array<Team>>;
}

export interface ProjectRepository {

    createProject(name: string, owner: any, team: any, network: NetworkType, status: StatusType, description: string): Promise<Project>;
    findProjects(params: {}, size: number, page: number): Promise<Project[]>;
    findProject(projectId: string): Promise<Project>;
    updateProject(project: Project): Promise<Project>;
    deleteProject(projectId: string): Promise<void>;

    createInstance(instance: Instance): Promise<Instance>;
    findInstances(params: {}): Promise<Instance[]>;
    findInstance(instanceId: string): Promise<Instance>;
    updateInstance(instance: Instance): Promise<Instance>;
    deleteInstance(instance: Instance): Promise<Instance>;

    createInstanceResources(instanceId: string, resources: KubernetesResources): Promise<void>;
    getInstanceResources(instanceId: string): Promise<KubernetesResources>;
    getInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<KubernetesResource>;
    updateInstanceResource(resource: KubernetesResource): Promise<KubernetesResource>;
    deleteInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<void> 
}

export interface IAMService {
//    createResourceOwner(user: User): Promise<User>;
//  createTeamMember(user: User): Promise<User>
//  updateUser(user: User): Promise<User>;
    findUsers(limit: number, page: number): Promise<User[]>;
    findByUserID(userId: string): Promise<User>;
// findByEmail(email: string): Promise<User>;
//    activateUser(userId: string): Promise<void>;
//    deactivateUser(userId: string): Promise<void>;
//  resetPassword(userId: string): Promise<void>;
// findTeams(teamId: string): Promise<Team>;
// findUserMemberships(userId: string): Promise<Team>;
// addTeamMember(teamId: string, email: string): Promise<Team>;
// removeTeamMember(teamId: string, memberId: string): Promise<Team>;
}

export interface ProjectService {
    createProject(project: Project): Promise<Project>;
    findProjects(params: QueryParams): Promise<Project[]>;
    findProject(projectId: string): Promise<Project>;
    updateProject(projectId: string, project: Project): Promise<Project>;
    repairProject(projectId: string): Promise<Project>;
    deleteProject(projectId: string): Promise<Project>;
    purgeProject(projectId: string): Promise<Project>;
    updateProjectResource(): Promise<KubernetesResource>

    createInstance(project: Project, instance: Instance): Promise<Instance>;
    findAllInstances(): Promise<Instance[]>;
    findInstances(params: QueryParams): Promise<Instance[]>;
    findInstance(instanceId: string): Promise<Instance>;
    updateInstance(instanceId: string, instance: Instance): Promise<Instance>;
    repairInstance(instanceId: string): Promise<Instance>;
    startInstance(instanceId: string): Promise<void>;
    stopInstance(instanceId: string): Promise<void>;
    createInstanceBackup(instanceId: string): Promise<void>;
    createInstanceBackupSchedule(instanceId: string, request: SnapshotScheduleRequest): Promise<void>;
    deleteInstance(instanceId: string): Promise<void>;
    purgeInstance(instanceId: string): Promise<void>;

    getInstanceResources(instanceId: string): Promise<KubernetesResources>;
    getInstanceResource(instanceId: string): Promise<KubernetesResource>;
    updateInstanceResource(instanceId: string, resource: KubernetesResource): Promise<KubernetesResource>;
    deleteInstanceResource(instanceId: string, resourceId: string): Promise<void>;
}