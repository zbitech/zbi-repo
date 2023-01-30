import { ProjectRepository } from "../../interfaces";
import { Project, Instance, KubernetesResource, KubernetesResources } from "../../model/model";
import { ResourceType, NetworkType, StatusType } from "../../model/zbi.enum";
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

    async createProject(project: Project): Promise<Project> {
        let logger = getLogger('pmr.createProject');
        try {
            const obj:any = {...project, owner: project.owner.userId, team: project.team.id};
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
            
            throw new Error("item not found");
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
            await inst.populate({path: "project", select: {name: 1}});
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
        let logger = getLogger('pmr.findInstance');
        try {
            const inst = await this.instanceModel.findById(instanceId)
                                .populate({path: "project", select: {name: 1}});
            if(inst) {
                logger.info(`found instance: ${JSON.stringify(inst)}`);
                return helper.createInstance(inst);
            }

            logger.error(`item ${instanceId} not found`);
            throw new Error("item not found");
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
            await inst.populate({path: "project", select: {name: 1}});
            
            return helper.createInstance(inst);
        } catch (err) {
            throw err;
        }

    }

    async deleteInstance(instanceId: string): Promise<void> {
        let logger = getLogger('pmr.deleteInstance');
        try {
            const inst = await this.instanceModel.findByIdAndDelete(instanceId);
            logger.info(`deleted instance (${instanceId}) => ${JSON.stringify(inst)}`);
            if(inst?._id.toString() !== instanceId) throw new Error("item not found");
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
        let logger = getLogger('pmr.getInstanceResource');
        try {

            const ic = await this.instanceModel.find({"_id": instanceId}, {
                name: 1,
                resources: 1
            });
            logger.info(`found resources => ${JSON.stringify(ic)}`);

            if( ic.length > 0 ) {
                if( resourceType == ResourceType.snapshotschedule ) {
                    if(ic[0].resources.snapshotschedule) return helper.createKubernetesResource(ic[0].resources.snapshotschedule);
                } else if (resourceType == ResourceType.volumesnapshot) {
                    const resources:any = ic[0].resources.volumesnapshot.filter( (resource:any) => resource.name == name);
                    if(resources.length>0) return helper.createKubernetesResource(resources[0]);
                } else if (resourceType == ResourceType.configmap) {
                    if(ic[0].resources.configmap) return helper.createKubernetesResource(ic[0].resources.configmap);
                } else if (resourceType == ResourceType.secret) {
                    if(ic[0].resources.secret) return helper.createKubernetesResource(ic[0].resources.secret);
                } else if (resourceType == ResourceType.persistentvolumeclaim) {
                    if(ic[0].resources.persistentvolumeclaim) return helper.createKubernetesResource(ic[0].resources.persistentvolumeclaim);
                } else if (resourceType == ResourceType.deployment) {
                    if(ic[0].resources.deployment) return helper.createKubernetesResource(ic[0].resources.deployment);
                } else if (resourceType == ResourceType.service) {
                    if(ic[0].resources.service) return helper.createKubernetesResource(ic[0].resources.service);
                } else if (resourceType == ResourceType.httpproxy) {
                    if(ic[0].resources.httpproxy) return helper.createKubernetesResource(ic[0].resources.httpproxy);
                }
            }

            throw new Error("item not found");

            // if( resourceType == ResourceType.snapshotschedule ) {
            //     const tc = await this.instanceModel.find({"resources.schedule.type": resourceType, "resources.schedule.name": name}, {
            //         name: 1,
            //         resources: {
            //             $elemMatch: {"schedule.name": name}
            //         }
            //     })

            //     return helper.createKubernetesResource(tc.resources.schedule);
            // } else if (resourceType == ResourceType.volumesnapshot) {
            //     const tc = await this.instanceModel.find({"resources.snapshots.type": resourceType, "resources.snapshots.name": name}, {
            //         name: 1,
            //         resources: {
            //             $elemMatch: {"snapshots.name": name}
            //         }
            //     });

            //     if(tc.resources.snapshots.length > 0)
            //         return helper.createKubernetesResource(tc.resources.snapshot[0]);
            //     throw new Error("item not found");
            // } else {
            //     const tc = await this.instanceModel.find({"_id": instanceId, "resources.resources.name": name}, {
            //         name: 1,
            //         resources: {
            //             $elemMatch: {"resources.name": name}
            //         }
            //     });

            //     logger.info(`found resource => ${JSON.stringify(tc)}`);
            //     if(tc[0].resources.resources.length > 0)
            //         return helper.createKubernetesResource(tc[0].resources.resources[0]);
            //     throw new Error("item not found");
            // }

        } catch (err) {
            throw err;
        }
    }

    async updateInstanceResource(instanceId: string, resource: KubernetesResource, updated: Date): Promise<KubernetesResource> {
        try {
            const instance = await this.instanceModel.findById(instanceId);

            let newResource: any;

            if (resource.type == ResourceType.volumesnapshot) {
                let found:boolean = false;
                instance.resources.volumesnapshot = instance.resources.volumesnapshot.map((snapshot:any) => {
                    if(snapshot.name == name) {
                        snapshot.status = resource.status;
                        snapshot.properties = resource.properties;
                        snapshot.updated = updated;
                        found = true;
                    }
                });

                if(!found) {
                    newResource = {...resource, created: updated, updated};
                    instance.resources.snapshots.push(newResource);
                }

                //TODO - check the length and generate event to remove snapshot if needed. This should be in a service-layer
            } else {

                if( resource.type == ResourceType.snapshotschedule ) {
                    newResource = instance.resources.snapshotschedule;
                } else if (resource.type == ResourceType.configmap) {
                    newResource = instance.resources.configmap;
                } else if (resource.type == ResourceType.secret) {
                    newResource = instance.resources.secret;
                } else if (resource.type == ResourceType.persistentvolumeclaim) {
                    newResource = instance.resources.persistentvolumeclaim;
                } else if (resource.type == ResourceType.deployment) {
                    newResource = instance.resources.deployment;
                } else if (resource.type == ResourceType.service) {
                    newResource = instance.resources.service;
                } else if (resource.type == ResourceType.httpproxy) {
                    newResource = instance.resources.httpproxy;
                } else {
                    throw new Error("item not found");
                }

                newResource.status = resource.status;
                newResource.properties = resource.properties;
                newResource.updated = updated;
            }

            await instance.save();
            return helper.createKubernetesResource(newResource);

            // if( resourceType == ResourceType.snapshotschedule ) {

            //     instance.resources.schedule.status = status;
            //     instance.resources.schedule.properties = properties; 
            //     instance.resources.schedule.updated = updated;

            // } else if (resourceType == ResourceType.volumesnapshot) {

            //     let found:boolean = false;
            //     instance.resources.snapshots = instance.resources.snapshots.map((snapshot:any) => {
            //         if(snapshot.name == name) {
            //             snapshot.status = status;
            //             snapshot.properties = properties;
            //             snapshot.updated = updated;
            //             found = true;
            //         }
            //     });

            //     if(!found) {
            //         instance.resources.snapshots.push({
            //             name, type: resourceType, status, properties, updated
            //         });
            //     }

            //     await instance.save();
            // } else {
            //     let found:boolean = false;
            //     instance.resources.resources = instance.resources.resources.map((resource:any) => {
            //         if(resource.name == name) {
            //             resource.status = status;
            //             resource.properties = properties;
            //             resource.updated = updated;
            //             found = true;
            //         }
            //     });

            //     if(!found) {
            //         instance.resources.resources.push({name, type: resourceType, status, properties, updated});
            //     }

            //     await instance.save();
            // }


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
