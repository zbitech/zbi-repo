import { ProjectRepository } from "src/interfaces";
import { Project, Instance, KubernetesResource, KubernetesResources } from "src/model/model";
import { ResourceType, NetworkType, StatusType } from "src/model/zbi.enum";
import model from "./mongo.model";
import mongoose from 'mongoose';
import { getLogger } from "../../logger"

export default class ProjectMongoRepository implements ProjectRepository {

    projectModel: any;
    instanceModel: any;
    
    constructor() {
        this.projectModel = model.projectModel;
        this.instanceModel = model.instanceModel;
    }

    async createProject(name: string, owner: any, team: any, network: NetworkType, status: StatusType, description: string): Promise<Project> {
        let logger = getLogger('pmr');
        try {
            const obj:any = {name, owner, team, network, status, description};
            logger.info("creating project " + JSON.stringify(obj) );
            const proj = new this.projectModel(obj);
            await proj.save();
            await proj.populate('owner');
            await proj.populate('team');
            return createProject(proj);
        } catch(err) {
            throw err;
        }
    }

    async findProjects(params: {}, size: number, page: number): Promise<Project[]> {
        try {
            const projs = await this.projectModel.find(params);
            return createProjects(projs);
        } catch(err) {
            throw err;
        }
    }

    async findProject(projectId: string): Promise<Project> {
        throw new Error("Method not implemented.");
    }

    async updateProject(project: Project): Promise<Project> {
        throw new Error("Method not implemented.");
    }

    async deleteProject(projectId: string): Promise<void> {
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

function createProject(project: any): Project {
    return {
        id: project._id,
        name: project.name,
        owner: project.owner,
        team: project.team,
        network: project.network,
        status: project.status,
        description: project.description 
    }
}

function createProjects(projects: any[]): Project[] {
    return projects.map( project => createProject(project));
}