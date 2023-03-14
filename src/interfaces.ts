import { Instance, KubernetesResource, KubernetesResources, Project, ProjectRequest, QueryFilter, SnapshotScheduleRequest, Team, TeamMembership, User, QueryParam } from "./model/model";
import { ResourceType, SnapshotScheduleType, NetworkType, StatusType, InviteStatusType } from "./model/zbi.enum";
import { Handler } from "express";

export interface Database {
    init(): Promise<void>;
    connect(): Promise<void>;
    close(): Promise<void>;
    clear(): Promise<void>;
}


export interface UserRepository {
    createUser(user: User): Promise<User>;
    updateUser(user: User): Promise<User>;
    findUsers(params: QueryParam, size: number, page: number): Promise<Array<User>>;
    findUser(params: QueryParam): Promise<User>;
    activateUser(username: string): Promise<void>;
    deactivateUser(username: string): Promise<void>;
    deleteUser(username: string): Promise<void>;

    createTeam(owner: string, name: string): Promise<Team>;
    findTeams(size: number, page: number): Promise<Array<Team>>;
    findTeam(teamId: string): Promise<Team>;
    findTeamMemberships(username: string): Promise<Array<Team>>
    removeTeamMembership(teamId: string, username: string): Promise<Team>;
    addTeamMembership(teamId: string, username: string): Promise<Team>;
    findPendingMemberships(): Promise<Array<Team>>;
}

export interface ProjectRepository {
    createProject(project: ProjectRequest): Promise<Project>;
    findProjects(params: QueryParam, size: number, page: number): Promise<Project[]>;
    findProject(projectId: string): Promise<Project>;
    findProjectByName(name: string): Promise<Project>;
    updateProject(project: Project): Promise<Project>;
    deleteProject(projectId: string): Promise<void>;

    createInstance(projectId: string, instance: Instance): Promise<Instance>;
    findInstances(params: QueryParam): Promise<Instance[]>;
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

export interface IdentityService {
    createUser(user: User): Promise<User>;
    updateUser(user: User): Promise<User>;
    getUserById(userid: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    resetPassword(userid: string): Promise<void>;
    deactivateUser(userid: string): Promise<void>;
    activateUser(userid: string): Promise<void>;
    deleteUser(userid: string): Promise<void>;
    getAccountActivity(userid: string): Promise<void>;
    getLoginURL(): string;
    getAccessVerifier(): Handler;
}


export interface UserService {
    createUser(user: User): Promise<User>;
    updateUser(user: User): Promise<User>;
    registerUser(userid: string): Promise<User>;
    findUsers(params: QueryParam, size: number, page: number): Promise<User[]>;
    findUser(params: QueryParam): Promise<User>;
    deactivateUser(userid: string): Promise<User>;
    reactivateUser(userid: string): Promise<User>;
    deleteUser(userid: string): Promise<void>;
    createTeam(owner: string, name: string): Promise<Team>;
    updateTeam(teamid: string, name: string): Promise<Team>;
    findTeams(params: QueryParam, size: number, page: number): Promise<Team[]>;
    findTeam(teamid: string): Promise<Team>;
    findTeamMemberships(userid: string): Promise<TeamMembership[]>;
    addTeamMember(teamid: string, userid: string): Promise<Team>;
    removeTeamMember(teamid: string, userid: string): Promise<Team>;
    updateTeamMembership(userid: string, status: InviteStatusType): Promise<void>;
}

export interface ProjectService {
    createProject(project: ProjectRequest): Promise<Project>;
    findProjects(params: QueryParam, size: number, page: number): Promise<Project[]>;
    findProject(projectId: string): Promise<Project>;
    updateProject(project: Project): Promise<Project>;
    repairProject(projectId: string): Promise<Project>;
    deleteProject(projectId: string): Promise<Project>;
    purgeProject(projectId: string): Promise<void>;
    updateProjectResource(projectId: string, resource: KubernetesResource): Promise<void>

    createInstance(project: Project, instance: Instance): Promise<Instance>;
    findAllInstances(params: QueryParam, size: number, page: number): Promise<Instance[]>;
    findInstances(params: QueryParam, size: number, page: number): Promise<Instance[]>;
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