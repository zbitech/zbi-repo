import { Instance, KubernetesResource, Project, Team, User } from "./model/model";
import { ResourceType } from "./model/zbi.enum";

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
    createProject(project: Project): Promise<Project|undefined>;
    findProjects(params: {}, limit: number, skip: number): Promise<Array<Project>|undefined>;
    findProject(instanceId: string): Promise<Project|undefined>;
    updateProject(project: Project): Promise<Project|undefined>;
    deleteProject(instanceId: string): Promise<void>;

    createInstance(instance: Instance): Promise<Instance|undefined>;
    findInstances(params: {}): Promise<Array<Instance>|undefined>;
    findInstance(instanceId: string): Promise<Instance|undefined>;
    updateInstance(instance: Instance): Promise<Instance|undefined>;

    getInstanceResources(instanceId: string): Promise<Array<KubernetesResource>|undefined>;
    getInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<KubernetesResource|undefined>;
    updateInstanceResource(resource: KubernetesResource): Promise<KubernetesResource|undefined>;
}

export interface IAMService {
    findUsers(limit: number, page: number): Promise<User[]>;
    findByUserID(userId: string): Promise<User>;
}