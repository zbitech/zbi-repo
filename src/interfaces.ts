import { Instance, KubernetesResource, KubernetesResources, Project, ProjectRequest, QueryFilter, SnapshotScheduleRequest, Team, TeamMembership, User, QueryParam, AuthRequest, AuthResult, RegisterRequest, RegisterResult, Registration, InstanceRequest, ResourceRequest, Job } from "./model/model";
import { ResourceType, SnapshotScheduleType, NetworkType, StatusType, InviteStatusType, UserStatusType, RoleType, LoginProvider, Action, Permission, NodeType, VolumeType, VolumeSourceType } from "./model/zbi.enum";
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
    findUsers(params: QueryParam): Promise<Array<User>>;
    findUser(params: QueryParam): Promise<User>;
    activateUser(userid: string): Promise<User>;
    deactivateUser(userid: string): Promise<User>;
    deleteUser(userid: string): Promise<void>;
    setPassword(email: string, password: string): Promise<void>;
    validatePassword(email: string, password: string): Promise<User|undefined>;

    createTeam(owner: string, name: string): Promise<Team>;
    deleteTeam(teamid: string): Promise<void>;
    updateTeam(teamid: string, name: string): Promise<Team>;
    findTeams(): Promise<Array<Team>>;
    findTeam(teamId: string): Promise<Team>;
    findTeamMemberships(username: string): Promise<Array<Team>>
    removeTeamMembership(teamId: string, username: string): Promise<Team>;
    addTeamMembership(teamId: string, username: string): Promise<Team>;
    updateTeamMembership(teamId: string, userid: string, status: InviteStatusType): Promise<Team>;
    findPendingMemberships(): Promise<Array<Team>>;
}

export interface ProjectRepository {
    createProject(project: ProjectRequest): Promise<Project>;
    findProjects(params: QueryParam): Promise<Project[]>;
    findProject(projectId: string): Promise<Project>;
    findProjectByName(name: string): Promise<Project>;
    updateProject(project: Project): Promise<Project>;
    deleteProject(projectId: string): Promise<void>;

    getProjectJobs(projectId: string): Promise<string[]>;
    addProjectJob(projectId: string, jobId: string): Promise<void>;
    updateProjectJob(projectId: string, jobId: string, status: string): Promise<void>;

    createInstance(projectId: string, instance: Instance): Promise<Instance>;
    findInstances(params: QueryParam): Promise<Instance[]>;
    findInstance(instanceId: string): Promise<Instance>;
    findInstanceByName(project: string, name: string): Promise<Instance>;
    updateInstance(instance: Instance): Promise<Instance>;
    deleteInstance(instanceId: string): Promise<void>;

    getInstanceJobs(instanceId: string): Promise<string[]>;
    addInstanceJob(instanceId: string, jobId: string): Promise<void>;
    updateInstanceJob(instanceId: string, jobId: string, status: string): Promise<void>;

    createInstanceResources(instanceId: string, resources: KubernetesResources): Promise<KubernetesResources>;
    getInstanceResources(instanceId: string): Promise<KubernetesResources>;
    getInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<KubernetesResource>;
    updateInstanceResource(instanceId: string, resource: KubernetesResource): Promise<KubernetesResource>;
    deleteInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<void>;

    getInstanceResourceJobs(instanceId: string, resourceType: ResourceType, name: string): Promise<string[]>;
    addInstanceResourceJob(instanceId: string, resourceType: ResourceType, name: string, jobId: string): Promise<void>;
    updateInstanceResourceJob(instanceId: string, resourceType: ResourceType, name: string, jobId: string, status: string): Promise<void>;

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
    findUsers(params: QueryParam): Promise<User[]>;
    findUser(params: QueryParam): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    getUserById(userid: string): Promise<User>;
    deactivateUser(userid: string): Promise<User>;
    reactivateUser(userid: string): Promise<User>;
    deleteUser(userid: string): Promise<void>;
    createTeam(ownerEmail: string, name: string): Promise<Team>;
    updateTeam(teamid: string, name: string): Promise<Team>;
    deleteTeam(teamid: string): Promise<void>;
    findTeams(params: QueryParam): Promise<Team[]>;
    findTeam(teamid: string): Promise<Team>;
    findTeamMemberships(userid: string): Promise<TeamMembership[]>;
//    findTeamMembership(teamid: string, userid: string): Promise<Team>;
    addTeamMember(teamid: string, email: string): Promise<Team>;
    removeTeamMember(teamid: string, email: string): Promise<Team>;
    updateTeamMembership(email: string, teamid: string, status: InviteStatusType): Promise<void>;
}

export interface ProjectService {
    createProject(project: ProjectRequest): Promise<Project>;
    findProjects(params: QueryParam): Promise<Project[]>;
    findProject(projectId: string): Promise<Project>;
    findProjectByName(name: string): Promise<Project>;
    updateProject(project: Project): Promise<Project>;
    repairProject(project: Project): Promise<Project>;
    deleteProject(project: Project): Promise<Project>;
    purgeProject(project: Project): Promise<void>;
    updateProjectResource(project: Project, resource: KubernetesResource): Promise<void>

    createInstance(project: Project, instance: InstanceRequest): Promise<Instance>;
    findAllInstances(params: QueryParam): Promise<Instance[]>;
    findInstances(params: QueryParam): Promise<Instance[]>;
    findInstance(instanceId: string): Promise<Instance>;
    findInstanceByName(projectName: string, instanceName: string): Promise<Instance>;
    updateInstance(project: Project, instance: Instance, request: InstanceRequest): Promise<Instance>;
    repairInstance(project: Project, instance: Instance): Promise<Instance>;
    startInstance(project: Project, instance: Instance): Promise<Instance>;
    stopInstance(project: Project, instance: Instance): Promise<Instance>;
    createInstanceSnapshot(project: Project, instance: Instance): Promise<Instance>;
    createInstanceSnapshotSchedule(projec: Project, instance: Instance, request: SnapshotScheduleRequest): Promise<Instance>;
    deleteInstance(project: Project, instance: Instance): Promise<Instance>;
    purgeInstance(project: Project, instance: Instance): Promise<void>;

    getInstanceResources(project: Project, instance: Instance): Promise<KubernetesResources>;
    getInstanceResource(project: Project, instance: Instance, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource>;
    updateInstanceResource(project: Project, instance: Instance, resource: KubernetesResource): Promise<KubernetesResource>;
    deleteInstanceResource(project: Project, instance: Instance, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource>;
}

export interface ControllerService {
    getStatus(): Promise<void>;

    getProject(projectName: string): Promise<Project>;
    createProject(project: Project): Promise<Project>;
    repairProject(Project: Project): Promise<Project>;
    deleteProject(Project: Project): Promise<void>;

    getInstance(projectName: string, instanceName: string): Promise<Instance>;
    createInstance(project: Project, instance: Instance): Promise<void>;
    updateInstance(project: Project, instance: Instance): Promise<void>;
    repairInstance(project: Project, instance: Instance): Promise<Instance>;
    deleteInstance(projectName: string, instanceName: string): Promise<void>;
    stopInstance(project: Project, instance: Instance): Promise<Instance>;
    startInstance(project: Project, instance: Instance): Promise<Instance>;
    rotateInstanceCredentials(project: Project, instance: Instance): Promise<Instance>;
    createInstanceSnapshot(project: Project, instance: Instance): Promise<Instance>;
    createInstanceSnapshotSchedule(project: Project, instance: Instance, schedule: SnapshotScheduleRequest): Promise<Instance>;
 
    getInstanceResources(projectName: string, instanceName: string): Promise<KubernetesResources>;
    getInstanceResource(projectName: string, instanceName: string, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource>;
    deleteInstanceResource(projectName: string, instanceName: string, resourceType: ResourceType, resourceName: string): Promise<void>;
}

export interface IJobService {

    createProject(project: Project): Promise<Job>;
    repairProject(project: Project): Promise<Job>;
    deleteProject(project: Project): Promise<Job>;

    createInstance(project: Project, instance: Instance): Promise<Job>;
    updateInstance(project: Project, instance: Instance): Promise<Job>;
    repairInstance(project: Project, instance: Instance): Promise<Job>;
    deleteInstance(project: Project, instance: Instance): Promise<Job>;
    startInstance(project: Project, instance: Instance): Promise<Job>;
    stopInstance(project: Project, instance: Instance): Promise<Job>;

    createInstanceSnapshot(project: Project, instance: Instance): Promise<Job>;
    deleteInstanceSnapshot(project: Project, instance: Instance, snapshot: string): Promise<Job>;

    createInstanceSchedule(project: Project, instance: Instance, scheduleRequest: SnapshotScheduleRequest): Promise<Job>;
    deleteInstanceSchedule(project: Project, instance: Instance, schedule: string): Promise<Job>;

    getProjectJobs(projectid: string): Promise<Job[]>;
    getProjectJob(projectid: string, jobid: string): Promise<Job>;
    cancelProjectJob(projectid: string, jobid: string): Promise<Job>;

    getInstanceJobs(instanceid: string): Promise<Job[]>;
    getInstanceJob(instanceid: string, jobid: string): Promise<Job>;
    cancelInstanceJob(instanceid: string, jobid: string): Promise<Job>;
}