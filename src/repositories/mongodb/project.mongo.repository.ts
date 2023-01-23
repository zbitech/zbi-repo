import { ProjectRepository } from "src/interfaces";
import { Project, Instance, KubernetesResource, KubernetesResources } from "src/model/model";
import { ResourceType } from "src/model/zbi.enum";
import model from "./mongo.model";

export class ProjectMongoRepository implements ProjectRepository {

    projectModel: any;
    instanceModel: any;
    
    constructor() {
        this.projectModel = model.projectModel;
        this.instanceModel = model.instanceModel;
    }

    async createProject(project: Project): Promise<Project> {
        throw new Error("Method not implemented.");
    }

    async findProjects(params: {}, limit: number, skip: number): Promise<Project[]> {
        throw new Error("Method not implemented.");
    }

    async findProject(instanceId: string): Promise<Project> {
        throw new Error("Method not implemented.");
    }

    async updateProject(project: Project): Promise<Project> {
        throw new Error("Method not implemented.");
    }

    async deleteProject(instanceId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createInstance(instance: Instance): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async findInstances(params: {}): Promise<Instance[]> {
        throw new Error("Method not implemented.");
    }

    async findInstance(instanceId: string): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async updateInstance(instance: Instance): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async deleteInstance(instance: Instance): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async createInstanceResources(instanceId: string, resources: KubernetesResources): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getInstanceResources(instanceId: string): Promise<KubernetesResources> {
        throw new Error("Method not implemented.");
    }

    async getInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<KubernetesResource> {
        throw new Error("Method not implemented.");
    }

    async updateInstanceResource(resource: KubernetesResource): Promise<KubernetesResource> {
        throw new Error("Method not implemented.");
    }

    async deleteInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}