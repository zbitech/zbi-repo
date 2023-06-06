import { Instance, KubernetesResource, KubernetesResources, Project, ProjectRequest, QueryFilter, SnapshotScheduleRequest, Team, TeamMembership, User, QueryParam, AuthRequest, AuthResult, RegisterRequest, RegisterResult, Registration } from "./model/model";
import { ResourceType, SnapshotScheduleType, NetworkType, StatusType, InviteStatusType, UserStatusType, RoleType, LoginProvider, Action, Permission, JobType } from "./model/zbi.enum";
import { Handler } from "express";

export interface Database {
    init(): Promise<void>;
    connect(): Promise<void>;
    close(): Promise<void>;
    clear(): Promise<void>;
}


export interface UserRepository {
    createUser(email: string, role: RoleType, status: UserStatusType): Promise<User>;
    updateUser(email: string, name: string, status: UserStatusType): Promise<User>;
    findRegistration(email: string): Promise<Registration>;
    createRegistration(email: string, name: string, provider: LoginProvider): Promise<Registration>;
    getUserByEmail(email: string): Promise<User>;
    getUserById(userid: string): Promise<User>;
    findUsers(params: QueryParam, size: number, page: number): Promise<Array<User>>;
    findUser(params: QueryParam): Promise<User>;
    activateUser(userid: string): Promise<User>;
    deactivateUser(userid: string): Promise<User>;
    deleteUser(userid: string): Promise<void>;
    setPassword(email: string, password: string): Promise<void>;
    validatePassword(email: string, password: string): Promise<User|undefined>;

    createTeam(owner: string, name: string): Promise<Team>;
    deleteTeam(teamid: string): Promise<void>;
    updateTeam(teamid: string, name: string): Promise<Team>;
    findTeams(size: number, page: number): Promise<Array<Team>>;
    findTeam(teamId: string): Promise<Team>;
    findTeamMemberships(username: string): Promise<Array<Team>>
    removeTeamMembership(teamId: string, username: string): Promise<Team>;
    addTeamMembership(teamId: string, username: string): Promise<Team>;
    updateTeamMembership(teamId: string, userid: string, status: InviteStatusType): Promise<Team>;
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

export interface IJobRepository {

    // createProjectJob(userid: string, id: string, type: JobType): Promise<Job>;
    // createInstanceJob(userid: string, id: string, type: JobType): Promise<Job>;
    // createResourceJob(userid: string, id: string, resource: string, type: Job): Promise<Job>    

    // getJobs(params: QueryParam, size: number, page: number): Promise<Job[]>;
    // getJob(id: string): Promise<Job>;
    // updateJob(id: string, job: Job): Promise<Job>;
    // deleteJob(id: string): Promise<Job>;

}

export interface IdentityService {
    authenticateUser(user: AuthRequest): Promise<AuthResult>;
}

export interface IAccessService {
    
    validateUserPermission(user: User, permission: Permission): Promise<boolean>;
    validateTeamPermission(user: User, permission: Permission): Promise<boolean>;
    validateProjectPermission(user: User, permission: Permission): Promise<boolean>;
    validateInstancePermission(user: User, permission: Permission): Promise<boolean>;
    validateResourcePermission(user: User, permission: Permission): Promise<boolean>;
}

export interface UserService {
    createUser(email: string, role: RoleType, status: UserStatusType): Promise<User>;
    updateUser(email: string, name: string, status: UserStatusType): Promise<User>;
    authenticateUser(user: AuthRequest, provider: LoginProvider): Promise<AuthResult>;
    changePassword(email: string, old_password: string, new_password: string): Promise<User>;
    registerUser(provider: LoginProvider, email: string, name: string, password: string): Promise<User>;
    findUsers(params: QueryParam, size: number, page: number): Promise<User[]>;
    findUser(params: QueryParam): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getUserById(userid: string): Promise<User>;
    deactivateUser(userid: string): Promise<User>;
    reactivateUser(userid: string): Promise<User>;
    deleteUser(userid: string): Promise<void>;
    createTeam(ownerEmail: string, name: string): Promise<Team>;
    updateTeam(teamid: string, name: string): Promise<Team>;
    deleteTeam(teamid: string): Promise<void>;
    findTeams(params: QueryParam, size: number, page: number): Promise<Team[]>;
    findTeam(teamid: string): Promise<Team>;
    findTeamMemberships(userid: string): Promise<TeamMembership[]>;
//    findTeamMembership(teamid: string, userid: string): Promise<Team>;
    addTeamMember(teamid: string, email: string): Promise<Team>;
    removeTeamMember(teamid: string, email: string): Promise<Team>;
    updateTeamMembership(email: string, teamid: string, status: InviteStatusType): Promise<void>;
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

export interface IJobService {

    createProject(project: string): Promise<void>;
    repairProject(project: string): Promise<void>;
    deleteProject(project: string): Promise<void>;

    createInstance(instance: string): Promise<void>;
    updateInstance(instance: string): Promise<void>;
    repairInstance(instance: string): Promise<void>;
    deleteInstance(instance: string): Promise<void>;
    startInstance(instance: string): Promise<void>;
    stopInstance(instance: string): Promise<void>;

    createInstanceSnapshot(instance: string, snapshot: string): Promise<void>;
    deleteInstanceSnapshot(instance: string, snapshot: string): Promise<void>;

    createInstanceSchedule(instance: string, schedule: string): Promise<void>;
    deleteInstanceSchedule(instance: string, schedule: string): Promise<void>;

    processJobs(): Promise<void>;
}