import { ProjectRepository } from "../../interfaces";
import { Project, Instance, KubernetesResource, KubernetesResources, ProjectRequest, QueryParam } from "../../model/model";
import { ResourceType, NetworkType, StatusType, StateType } from "../../model/zbi.enum";
import model from "./mongo.model";
import mongoose from 'mongoose';
import { getLogger } from "../../libs/logger"
import * as helper from "./helper";
import { BadRequestError, ItemAlreadyExistsError, ItemNotFoundError, ItemType, ServiceError, ServiceType } from "../../libs/errors";

export default class ProjectMongoRepository implements ProjectRepository {

    projectModel: any;
    instanceModel: any;
    
    constructor() {
        this.projectModel = model.projectModel;
        this.instanceModel = model.instanceModel;
    }

    async createProject(project: ProjectRequest): Promise<Project> {
        let logger = getLogger('repo-crete-project');
        try {
            const obj:any = {...project, owner: project.owner, team: project.team, jobs: []};
            logger.info("creating project " + JSON.stringify(obj) );
            const proj = new this.projectModel(obj);
            if(proj) {
                await proj.save();
                await proj.populate({path: 'owner', select: {email: 1, name: 1}});
                await proj.populate({path: 'team', select: {name: 1}});
                logger.debug(`populating project details - ${JSON.stringify(proj)}`);
                return helper.createProject(proj);
            }

            throw new BadRequestError("failed to create project");
        } catch(err:any) {
            logger.error(err);
            const err_type = helper.getErrorType(err);

            if( err_type === helper.MongoErrorType.DUPLICATE_KEY) {
                throw new ItemAlreadyExistsError(ItemType.user, "project already exists");
            }

            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async findProjects(params: QueryParam): Promise<Project[]> {
        let logger = getLogger('repo-find-projects');
        try {
            const p = helper.createParam(params);

            const projs = await this.projectModel.find(p)
                                    .populate({path: "owner", select: {userName: 1, email: 1, name: 1}})
                                    .populate({path: "team", select:{name: 1}});

            if(projs) return helper.createProjects(projs);
            return [];
        } catch(err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async findProject(projectId: string): Promise<Project> {
        let logger = getLogger('repo-find-project');
        try {
            const project = await this.projectModel.findById(projectId)
                                        .populate({path: "owner", select: {name: 1}})
                                        .populate({path: "team", select:{name: 1}});
            if(project) {
                return helper.createProject(project);
            }

            return project;
        } catch(err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async findProjectByName(name: string): Promise<Project> {
        let logger = getLogger('repo-find-project-name');
        try {
            const project = await this.projectModel.findOne({name})
                                        .populate({path: "owner", select: {name: 1}})
                                        .populate({path: "team", select:{name: 1}});
            if(project) {
                return helper.createProject(project);
            }

            return project;
        } catch(err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }


    async updateProject(project: Project): Promise<Project> {
        let logger = getLogger('repo-update-project');
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
            
            throw new ItemNotFoundError(ItemType.project, "project not found");
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async deleteProject(projectId: string): Promise<void> {
        let logger = getLogger('repo-delete-project');
        try {
            const proj = await this.projectModel.findByIdAndDelete(projectId);
            if(proj._id !== projectId) throw new ItemNotFoundError(ItemType.project, "project not found");
        } catch (err:any) {
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async getProjectJobs(projectId: string): Promise<string[]> {
        try {
            const project = await this.projectModel.findById(projectId);
            if(project) {
                return project.jobs;
            }            
            return [];
        } catch (err: any) {
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async addProjectJob(projectId: string, jobId: string): Promise<void> {
        try {
            const proj = await this.projectModel.findById(projectId);
            if(proj) {
                proj.jobs.push([{id: jobId, status: 'pending'}]);
                await proj.save();
            }
            
        } catch (err: any) {
            throw err;            
        }
    }

    async updateProjectJob(projectId: string, jobId: string, status: string): Promise<void> {
        try {
            const project = await this.projectModel.findById(projectId);
            if(project) {
                for(let i=0; i<project.jobs.length; i++) {
                    if(project.jobs[i].id === jobId) {
                        project.jobs[i].status = status;
                    }
                }
            }
        } catch (err: any) {
            throw err;            
        }
    }

    async createInstance(projectId: string, instance: Instance): Promise<Instance> {
        const logger = getLogger('repo-create-instance');
        try {
            const inst = new this.instanceModel({...instance, project: projectId, jobs: []});
            if(inst) {
                logger.info(`creating new instance: ${JSON.stringify(inst)}`);
                await inst.save();
                await inst.populate({path: "project", select: {name: 1}});
                return helper.createInstance(inst);
            }

            throw new BadRequestError("failed to create instance");
        } catch (err:any) {
            logger.error(err);
            const err_type = helper.getErrorType(err);

            if( err_type === helper.MongoErrorType.DUPLICATE_KEY) {
                throw new ItemAlreadyExistsError(ItemType.user, "instance already exists");
            }

            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async findInstances(params: QueryParam): Promise<Instance[]> {
        const logger = getLogger('repo-find-instances');
        try {
            const p = helper.createParam(params);
            logger.info(`searching for instances - ${JSON.stringify(p)}`);
            const inst = await this.instanceModel.find(p, {name: 1, type: 1, status: 1, description: 1})
            if(inst) return helper.createInstances(inst);

            return [];
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async findInstance(instanceId: string): Promise<Instance> {
        let logger = getLogger('repo-find-instance');
        try {
            const inst = await this.instanceModel.findById(instanceId)
                                .populate({path: "project", select: {name: 1}});
            if(inst) {
                logger.info(`found instance: ${JSON.stringify(inst)}`);
                return helper.createInstance(inst);
            }

            return inst;
        } catch (err:any) {
            logger.err(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async findInstanceByName(project: string, name: string): Promise<Instance> {
        let logger = getLogger('repo-find-instance-name');
        try {
            const inst = await this.instanceModel.findOne({name, project})
                                .populate({path: "project", select: {name: 1}});
            if(inst) {
                logger.info(`found instance: ${JSON.stringify(inst)}`);
                return helper.createInstance(inst);
            }

            return inst;
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async updateInstance(instance: Instance): Promise<Instance> {
        let logger = getLogger('repo-update-nstance');
        try {
            const inst = await this.instanceModel.findById(instance.id);

            if(inst) {
                if( instance.description ) inst.description = instance.description;
                inst.status = instance.status;
                inst.state = instance.state;
                inst.request = instance.request;
                await inst.save();
                await inst.populate({path: "project", select: {name: 1}});
            
                return helper.createInstance(inst);
            }

            throw new ItemNotFoundError(ItemType.instance, `instance not found`);
        } catch (err: any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }

    }

    async deleteInstance(instanceId: string): Promise<void> {
        let logger = getLogger('repo-delete-instance');
        try {
            const inst = await this.instanceModel.findByIdAndDelete(instanceId);
            if(inst) {
                logger.info(`deleted instance (${instanceId}) => ${JSON.stringify(inst)}`);
                if(inst?._id.toString() !== instanceId) throw new Error("item not found");
            }

            throw new ItemNotFoundError(ItemType.instance, `instance not found`);
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async getInstanceJobs(instanceId: string): Promise<string[]> {
        let logger = getLogger('get-instance-jobs');
        try {
            const instance = await this.instanceModel.findByIdAndDelete(instanceId);
            if(instance) {
                return instance.jobs;
            }            
            return [];
            
        } catch (err: any) {
            throw err;            
        }
    }

    async addInstanceJob(instanceId: string, jobId: string): Promise<void> {
        let logger = getLogger('add-instance-job');
        try {
            const instance = await this.instanceModel.findByIdAndDelete(instanceId);
            if(instance) {
                instance.jobs.push({id: jobId, status: 'pending'});
            }            
            
        } catch (err: any) {
            throw err;            
        }
    }

    async updateInstanceJob(instanceId: string, jobId: string, status: string): Promise<void> {
        let logger = getLogger('update-instance-job');
        try {
            const instance = await this.instanceModel.findByIdAndDelete(instanceId);
            if(instance) {
                for(let i=0; i<instance.jobs.length; i++) {
                    if(instance.jobs[i].id === jobId) {
                        instance.jobs[i].status = status;
                    }
                }
            }            
            
        } catch (err: any) {
            throw err;            
        }
    }

    async createInstanceResources(instanceId: string, resources: KubernetesResources): Promise<KubernetesResources> {
        let logger = getLogger('repo-create-instance-resources');
        try {
            const inst = await this.instanceModel.findById(instanceId);
            if(inst) {
                inst.resources = resources;
                await inst.save();
                return helper.createKubernetesResources(inst.resources);
            }

            throw new ItemNotFoundError(ItemType.instance, `instance not found`);
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async getInstanceResources(instanceId: string): Promise<KubernetesResources> {
        let logger = getLogger('repo-get-instance-resources');
        try {
            const inst = await this.instanceModel.findById(instanceId);
            if(inst) {
                return helper.createKubernetesResources(inst.resources);
            }
            throw new ItemNotFoundError(ItemType.instance, "instance not found");
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async getInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<KubernetesResource> {
        let logger = getLogger('repo-get-instance-resource');
        try {

            const ic = await this.instanceModel.find({"_id": instanceId}, {
                name: 1,
                resources: 1
            });

            if(ic) {
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

                return ic.resource;
            }

            throw new ItemNotFoundError(ItemType.instance, 'instance not found');
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async updateInstanceResource(instanceId: string, resource: KubernetesResource): Promise<KubernetesResource> {
        let logger = getLogger('repo-update-instance-resource');
        try {
            const instance = await this.instanceModel.findById(instanceId);

            if(!instance) {
                throw new ItemNotFoundError(ItemType.instance, 'instance not found');
            }

            if(!instance.resources) {
                instance.resources = {};
            }

            const resourceType = resource.type.toLowerCase();

            logger.info(`updating instance ${instance.name} with resource: ${JSON.stringify(resource)}`);

            if (resourceType == ResourceType.volumesnapshot) {
                let found:boolean = false;
                for(var index=0; index<instance.resources.volumesnapshot; index++) {
                    if(instance.resources.volumesnapshot[index].name === resource.name) {
                        instance.resources.volumesnapshot[index].status = resource.status;
                        instance.resources.volumesnapshot[index].properties = resource.properties;
                        instance.resources.volumesnapshot[index].updatedAt = new Date();
                        found = true;
                    }
                }

                if(!found) {
                    instance.resources.snapshots.push({...resource, createdAt: Date(), jobs: []});
                }

                //TODO - check the length and generate event to remove snapshot if needed. This should be in a service-layer
            } else {

                if( resourceType == ResourceType.snapshotschedule ) {
                    if(instance.resources.snapshotschedule) {
                        instance.resources.snapshotschedule.status = resource.status;
                        instance.resources.snapshotschedule.properties = resource.properties;
                        instance.resources.snapshotschedule.updatedAt = new Date();
                    } else {
                        instance.resources.snapshotschedule = {...resource, createdAt: Date(), jobs: []}
                    }
                } else if (resourceType == ResourceType.configmap) {
                    if(instance.resources.configmap) {
                        instance.resources.configmap.name = resource.name;
                        instance.resources.configmap.status = resource.status;
                        instance.resources.configmap.properties = resource.properties;
                        instance.resources.configmap.updatedAt = new Date();
                    } else {
                        instance.resources.configmap = {...resource, createdAt: Date(), jobs: []}
                    }
                } else if (resourceType == ResourceType.secret) {
                    if(instance.resources.secret) {
                        instance.resources.secret.name = resource.name;
                        instance.resources.secret.status = resource.status;
                        instance.resources.secret.properties = resource.properties;
                        instance.resources.secret.updatedAt = new Date();
                    } else {
                        instance.resources.secret = {...resource, createdAt: Date(), jobs: []}
                    }
                } else if (resourceType == ResourceType.persistentvolumeclaim) {
                    if(instance.resources.persistentvolumeclaim) {
                        instance.resources.persistentvolumeclaim.name = resource.name;
                        instance.resources.persistentvolumeclaim.status = resource.status;
                        instance.resources.persistentvolumeclaim.properties = resource.properties;
                        instance.resources.persistentvolumeclaim.updatedAt = new Date();
                    } else {
                        instance.resources.persistentvolumeclaim = {...resource, createdAt: Date(), jobs: []}
                    }
                } else if (resourceType == ResourceType.deployment) {
                    if(instance.resources.deployment) {
                        instance.resources.deployment.name = resource.name;
                        instance.resources.deployment.status = resource.status;
                        instance.resources.deployment.properties = resource.properties;
                        instance.resources.deployment.updatedAt = new Date();
                    } else {
                        instance.resources.deployment = {...resource, createdAt: Date(), jobs: []}
                    }

                    if(resource.status === StatusType.active ) {
                        instance.state = StateType.running;
                    } else if(resource.status === StatusType.deleted ) {
                        instance.state = StateType.stopped;
                    }

                } else if (resourceType == ResourceType.service) {
                    if(instance.resources.service) {
                        instance.resources.service.name = resource.name;
                        instance.resources.service.status = resource.status;
                        instance.resources.service.properties = resource.properties;
                        instance.resources.service.updatedAt = new Date();
                    } else {
                        instance.resources.service = {...resource, createdAt: Date(), jobs: []}
                    }

                } else if (resourceType == ResourceType.httpproxy) {
                    if(instance.resources.httpproxy) {
                        instance.resources.httpproxy.name = resource.name;
                        instance.resources.httpproxy.status = resource.status;
                        instance.resources.httpproxy.properties = resource.properties;
                        instance.resources.httpproxy.updatedAt = new Date();
                    } else {
                        instance.resources.httpproxy = {...resource, createdAt: Date(), jobs: []}
                    }

                } else {
                    throw new Error("item not found");
                }

                // newResource.status = resource.status;
                // newResource.properties = resource.properties;
            }

            await instance.save();
            // return helper.createKubernetesResource(newResource);
            return resource;

        } catch (err: any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async deleteInstanceResource(instanceId: string, resourceType: ResourceType, name: string): Promise<void> {
        let logger = getLogger('repo-delete-instance-resource');
;        try {
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
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.database, err.message);
        }
    }    

    async getInstanceResourceJobs(instanceId: string, resourceType: ResourceType, name: string): Promise<string[]> {
        let logger = getLogger('get-resource-jobs');
        try {
            let jobs: any[] = [];

            const instance = await this.instanceModel.findById(instanceId);
            if (resourceType == ResourceType.volumesnapshot) {
                for(let index=0; index<instance.resources.volumesnapshot.length; index++) {
                    if(instance.resources.volumesnapshot[index].name === name) {
                        jobs = instance.resources.volumesnapshot[index].jobs;
                    }
                }
            } else if(resourceType == ResourceType.snapshotschedule) {
                jobs = instance.resources.snapshotschedule.jobs;
            } else if(resourceType == ResourceType.deployment) {
                jobs = instance.resources.deployment.jobs;
            } else if(resourceType == ResourceType.service) {
                jobs = instance.resources.service.jobs;
            } else if(resourceType == ResourceType.secret) {
                jobs = instance.resources.secret.jobs;
            } else if(resourceType == ResourceType.configmap) {
                jobs = instance.resources.configmap.jobs;
            } else if(resourceType == ResourceType.persistentvolumeclaim) {
                jobs = instance.resources.persistentvolumeclaim.jobs;
            }

            return jobs.map((job:any) => job.id );
            
        } catch (err: any) {
            throw err;            
        }
    }

    async addInstanceResourceJob(instanceId: string, resourceType: ResourceType, name: string, jobId: string): Promise<void> {
        let logger = getLogger('add-resource-job');
        try {
            const instance = await this.instanceModel.findById(instanceId);
            let jobs: any[];

            if (resourceType == ResourceType.volumesnapshot) {
                for(let index=0; index<instance.resources.volumesnapshot.length; index++) {
                    if(instance.resources.volumesnapshot[index].name === name) {
                        instance.resources.volumesnapshot[index].jobs.push({id: jobId, status: 'pending'});
                    }
                }
            } else if(resourceType == ResourceType.snapshotschedule) {
                instance.resources.snapshotschedule.jobs.push({id: jobId, status: 'pending'});
            } else if(resourceType == ResourceType.deployment) {
                instance.resources.deployment.jobs.push({id: jobId, status: 'pending'});
            } else if(resourceType == ResourceType.service) {
                instance.resources.service.jobs.push({id: jobId, status: 'pending'});
            } else if(resourceType == ResourceType.secret) {
                instance.resources.secret.jobs.push({id: jobId, status: 'pending'});
            } else if(resourceType == ResourceType.configmap) {
                instance.resources.configmap.jobs.push({id: jobId, status: 'pending'});
            } else if(resourceType == ResourceType.persistentvolumeclaim) {
                instance.resources.persistentvolumeclaim.jobs.push({id: jobId, status: 'pending'});
            } 

            
        } catch (err: any) {
            throw err;            
        }
    }

    async updateInstanceResourceJob(instanceId: string, resourceType: ResourceType, name: string, jobId: string, status: string): Promise<void> {
        try {
            const instance = await this.instanceModel.findById(instanceId);

            if (resourceType == ResourceType.volumesnapshot) {
                for(let index=0; index<instance.resources.volumesnapshot.length; index++) {
                    if(instance.resources.volumesnapshot[index].name === name) {
                        for(var j=0; j<instance.resources.volumesnapshot[index].length; j++) {
                            if(instance.resources.volumesnapshot[index].jobs[j].id === jobId) {
                                instance.resources.volumesnapshot[index].jobs[j].status = status;
                            }
                        }
                    }
                }
            } else if(resourceType === ResourceType.snapshotschedule) {
                for(var i=0; i<instance.resources.snapshotschedule.jobs.length; i++) {
                    if(instance.resources.snapshotschedule.jobs[i]===jobId) {
                        instance.resources.snapshotschedule.jobs[i].status = status;
                    }
                }
            }

        } catch (err: any) {
            throw err;            
        }
    }

}