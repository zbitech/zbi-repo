import { Instance, Project, Team, User, KubernetesResource } from "../model/model";
import { ResourceType } from "../model/zbi.enum";

export interface IAMRepository {
    createUser(user: User): Promise<User|undefined>;
    updateUser(user: User): Promise<User|undefined>;
    findUsers(params: {}, limit: number, skip: number): Promise<Array<User>|undefined>;
    findUser(params: {}): Promise<User|undefined>;
    resetUserPassword(userName: string): Promise<void>;
    activateUser(userName: string): Promise<void>;
    deactivateUser(userName: string): Promise<void>;
    validateAuth(type: string, value: string): Promise<boolean>;
    findUserTeamMemberships(): Promise<void>;

    createTeam(ownerId: string, name: string): Promise<Team|undefined>;
    findTeams(limit: number, skip: number): Promise<Array<Team>|undefined>;
    findTeam(teamId: string): Promise<Team|undefined>;
    findTeamMemberships(userId: string): Promise<Array<Team>|undefined>
    removeTeamMembership(teamId: string, userId: string): Promise<Team|undefined>;
    addTeamMembership(teamId: string, userId: string): Promise<Team|undefined>;
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