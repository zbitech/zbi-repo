import { ProjectRepository } from "src/interfaces";
import { Project, Instance, KubernetesResource, KubernetesResources } from "src/model/model";
import { ResourceType, NetworkType, StatusType } from "src/model/zbi.enum";
import model from "./mongo.model";
import mongoose from 'mongoose';
import { getLogger } from "../../logger"
import * as helper from "./helper";

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
            await proj.populate({path: 'owner', select: {userName: 1, email: 1, name: 1}});
            await proj.populate({path: 'team', select: {name: 1}});
            return helper.createProject(proj);
        } catch(err) {
            throw err;
        }
    }

    async findProjects(params: {}, size: number, page: number): Promise<Project[]> {
        try {
            const projs = await this.projectModel.find(params)
                                    .limit(size)
                                    .skip(size * (page-1))
                                    .populate({path: "owner", select: {userName: 1, email: 1, name: 1}})
                                    .populate({path: "team", select:{name: 1}});
            return helper.createProjects(projs);
        } catch(err) {
            throw err;
        }
    }

    async findProject(projectId: string): Promise<Project> {
        try {
            const project = await this.projectModel.findById(projectId)
                                        .populate({path: "owner", select: {userName: 1, email: 1, name: 1}})
                                        .populate({path: "team", select:{name: 1}});
            return helper.createProject(project);
        } catch(err) {
            throw err;
        }
    }

    async updateProject(project: Project): Promise<Project> {
        try {
            const proj = await this.projectModel.findById(project.id);
            if(proj) {
                if(project.description) {
                    proj.description = project.description;
                }
                proj.status = project.status;
                await proj.save();

                return helper.createProject(proj);
            }   
            
            throw new Error("item not found!");
        } catch (err) {
            throw err;
        }
    }

    async deleteProject(projectId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createInstance(projectId: string, instance: Instance): Promise<Instance> {
        try {
            const inst = new this.instanceModel({...instance, project: projectId});
            await inst.save();
            return helper.createInstance(inst);
        } catch (err) {
            throw err;
        }
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