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
        try {
            const proj = await this.projectModel.findByIdAndDelete(projectId);
            if(proj._id !== projectId) throw new Error("item not found");
        } catch (err) {
            throw err;
        }
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
        try {
            const inst = await this.instanceModel.find({params});
            return helper.createInstances(inst);
        } catch (err) {
            throw err;
        }
    }

    async findInstance(instanceId: string): Promise<Instance> {
        try {
            const inst = await this.instanceModel.findById(instanceId);
            return helper.createInstance(inst);
        } catch (err) {
            throw err;
        }
    }

    async updateInstance(instance: Instance): Promise<Instance> {
        try {
            const inst = await this.instanceModel.findById(instance.id);

            if( instance.description ) inst.description = instance.description;
            inst.status = instance.status;
            inst.request = instance.request;
            await inst.save();

            return helper.createInstance(inst);
        } catch (err) {
            throw err;
        }

    }

    async deleteInstance(instanceId: string): Promise<void> {
        try {
            const inst = await this.instanceModel.findByIdAndDelete(instanceId);
            if(inst._id !== instanceId) throw new Error("item not found");
        } catch (err) {
            throw err;
        }
    }

    async createInstanceResources(instanceId: string, resources: KubernetesResources): Promise<KubernetesResources> {
        try {
            const inst = await this.instanceModel.findById(instanceId);
            inst.resources = resources;
            await inst.save();
            return helper.createKubernetesResources(inst.resources);
        } catch (err) {
            throw err;
        }
    }

    async getInstanceResources(instanceId: string): Promise<KubernetesResources> {
        try {
            const inst = await this.instanceModel.findById(instanceId);
            if(inst) {
                return helper.createKubernetesResources(inst.resources);
            }
            throw new Error("item not found");
        } catch (err) {
            throw err;
        }
    }

    async getInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<KubernetesResource> {
        try {
            if( resourceType == ResourceType.snapshotschedule ) {
                const tc = await this.instanceModel.find({"resources.schedule.type": resourceType, "resources.schedule.name": name}, {
                    name: 1,
                    resources: {
                        $elemMatch: {"schedule.name": name}
                    }
                })

                return helper.createKubernetesResource(tc.resources.schedule);
            } else if (resourceType == ResourceType.volumesnapshot) {
                const tc = await this.instanceModel.find({"resources.snapshots.type": resourceType, "resources.snapshots.name": name}, {
                    name: 1,
                    resources: {
                        $elemMatch: {"snapshots.name": name}
                    }
                });

                if(tc.resources.snapshots.length > 0)
                    return helper.createKubernetesResource(tc.resources.snapshot[0]);
                throw new Error("item not found");
            } else {
                const tc = await this.instanceModel.find({"resources.resources.type": resourceType, "resources.resources.name": name}, {
                    name: 1,
                    resources: {
                        $elemMatch: {"schedule.name": name}
                    }
                });

                if(tc.resources.resources.length > 0)
                    return helper.createKubernetesResource(tc.resources.resources[0]);
                throw new Error("item not found");
            }

        } catch (err) {
            throw err;
        }
    }

    async updateInstanceResource(instanceId: string, resource: KubernetesResource): Promise<KubernetesResource> {
        try {
            const instance = await this.instanceModel.findById(instanceId);

            if( resource.type == ResourceType.snapshotschedule ) {

                instance.resources.schedule.status = resource.status;
                instance.resources.schedule.properties = resource.properties; 

            } else if (resource.type == ResourceType.volumesnapshot) {

                let found:boolean = false;
                instance.resources.snapshots = instance.resources.snapshots.map((snapshot:any) => {
                    if(snapshot.name == resource.name) {
                        snapshot.schedule.status = resource.status;
                        snapshot.schedule.properties = resource.properties;
                        found = true;
                    }
                });

                if(!found) {
                    instance.resources.snapshots.push({
                        name: resource.name, type: resource.type, status: resource.status, properties: resource.properties
                    });
                }

                await instance.save();
            } else {
                let found:boolean = false;
                instance.resources.resources = instance.resources.resources.map((snapshot:any) => {
                    if(snapshot.name == resource.name) {
                        snapshot.schedule.status = resource.status;
                        snapshot.schedule.properties = resource.properties;
                        found = true;
                    }
                });

                if(!found) {
                    instance.resources.snapshots.push({
                        name: resource.name, type: resource.type, status: resource.status, properties: resource.properties
                    });
                }

                await instance.save();
            }

            return resource;
        } catch (err) {
            throw err;
        }
    }

    async deleteInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<void> {
        try {
            if( resourceType == ResourceType.snapshotschedule ) {
                const ic = await this.instanceModel.findByIdAndUpdate(instanceId, {"$pull": {"resources": {"schedule.name": name}}});
                if(ic.name !== name) throw new Error("item not found");
            } else if (resourceType == ResourceType.volumesnapshot) {
                const ic = await this.instanceModel.findByIdAndUpdate(instanceId, {"$pull": {"resources": {"snapshots.name": name}}});
                if(ic.name !== name) throw new Error("item not found");
            } else {
                const ic = await this.instanceModel.findByIdAndUpdate(instanceId, {"$pull": {"resources": {"resources.name": name}}});
                if(ic.name !== name) throw new Error("item not found");
            }            
        } catch (err) {
            throw err;
        }
    }
    
}