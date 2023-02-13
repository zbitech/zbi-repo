import { Instance, KubernetesResource, KubernetesResources, Project, ProjectRequest, QueryFilter, SnapshotScheduleRequest, Team, User } from "./model/model";
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
    createProject(project: ProjectRequest): Promise<Project>;
    findProjects(params: {}, size: number, page: number): Promise<Project[]>;
    findProject(projectId: string): Promise<Project>;
    findProjectByName(name: string): Promise<Project>;
    updateProject(project: Project): Promise<Project>;
    deleteProject(projectId: string): Promise<void>;

    createInstance(projectId: string, instance: Instance): Promise<Instance>;
    findInstances(params: {}): Promise<Instance[]>;
    findInstance(instanceId: string): Promise<Instance>;
    findInstanceByName(project: string, name: string): Promise<Instance>;
    updateInstance(instance: Instance): Promise<Instance>;
    deleteInstance(instanceId: string): Promise<void>;

    createInstanceResources(instanceId: string, resources: KubernetesResources): Promise<KubernetesResources>;
    getInstanceResources(instanceId: string): Promise<KubernetesResources>;
    getInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<KubernetesResource>;
    updateInstanceResource(instanceId: string, resource: KubernetesResource, upddated: Date): Promise<KubernetesResource>;
    deleteInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<void>;
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
    createProject(project: ProjectRequest): Promise<Project>;
    findProjects(params: QueryFilter): Promise<Project[]>;
    findProject(projectId: string): Promise<Project>;
    updateProject(project: Project): Promise<Project>;
    repairProject(projectId: string): Promise<Project>;
    deleteProject(projectId: string): Promise<Project>;
    purgeProject(projectId: string): Promise<void>;
    updateProjectResource(projectId: string, resource: KubernetesResource): Promise<void>

    createInstance(project: Project, instance: Instance): Promise<Instance>;
    findAllInstances(): Promise<Instance[]>;
    findInstances(params: QueryFilter): Promise<Instance[]>;
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
    getInstanceResource(instanceId: string, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource>;
    updateInstanceResource(instanceId: string, resource: KubernetesResource, updated: Date): Promise<KubernetesResource>;
    deleteInstanceResource(instanceId: string, resourceType: ResourceType, resourceName: string): Promise<void>;
}

export interface ControllerService {
    getStatus(): Promise<void>;

    getProject(projectName: string): Promise<Project>;
    createProject(project: Project): Promise<Project>;
    repairProject(Project: Project): Promise<Project>;
    deleteProject(Project: Project): Promise<void>;

    getInstance(projectName: string, instanceName: string): Promise<Instance>;
    createInstance(project: Project, instance: Instance): Promise<void>;
    repairInstance(project: Project, instance: Instance): Promise<Instance>;
    deleteInstance(projectName: string, instanceName: string): Promise<void>;
    stopInstance(project: Project, instance: Instance): Promise<Instance>;
    startInstance(project: Project, instance: Instance): Promise<Instance>;
    rotateInstanceCredentials(project: Project, instance: Instance): Promise<Instance>;
    createInstanceBackup(project: Project, instance: Instance): Promise<Instance>;
    createInstanceBackupSchedule(project: Project, instance: Instance, schedule: SnapshotScheduleRequest): Promise<Instance>;
 
    getInstanceResources(projectName: string, instanceName: string): Promise<KubernetesResources>;
    getInstanceResource(projectName: string, instanceName: string, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource>;
    deleteInstanceResource(projectName: string, instanceName: string, resourceType: ResourceType, resourceName: string): Promise<void>;
}