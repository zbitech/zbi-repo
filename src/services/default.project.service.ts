import { ProjectRepository, ProjectService, ControllerService } from "../interfaces";
import { Project, QueryFilter, KubernetesResource, Instance, SnapshotScheduleRequest, KubernetesResources, ProjectRequest, QueryParam, InstanceRequest } from "../model/model";
import { ProjectFilterType, ResourceType, StateType, StatusType, VolumeSourceType, VolumeType } from "../model/zbi.enum";
import { getLogger } from "../libs/logger"
import beanFactory from "../factory/bean.factory";
import { createResourceRequest } from "../libs/projects";
import { ServiceError, ItemNotFoundError, BadRequestError, ItemType } from "../libs/errors";

class DefaultProjectService implements ProjectService {

    async createProject(projectRequest: ProjectRequest): Promise<Project> {
        let logger = getLogger('psvc-create-project');
        try {

            logger.info(`project request = ${JSON.stringify(projectRequest)}`);

            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            // TODO - validate project

            const project = await projectRepository.createProject(projectRequest);

            await controllerService.createProject(project);

            return project;
        } catch (err:any) {
            logger.error(err);
            throw err
        }
    }

    async findProjects(params: QueryParam): Promise<Project[]> {
        let logger = getLogger('psvc-find-projects');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            return await projectRepository.findProjects(params);
        } catch (err:any) {
            logger.error(err);
            throw err
        }
    }

    async findProject(projectId: string): Promise<Project> {
        let logger = getLogger('psvc-find-project');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            return await projectRepository.findProject(projectId);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async findProjectByName(name: string): Promise<Project> {
        let logger = getLogger('psvc-find-project-name');
        try {
            logger.info(`searching for project - ${name}`);
            const projectRepository = beanFactory.getProjectRepository();
            return await projectRepository.findProjectByName(name);
        } catch (err) {
            logger.error(err);
            throw err;
        }        
    }

    async updateProject(project: Project): Promise<Project> {
        let logger = getLogger('psvc-update-project');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            // TODO - validate update
 
            const proj = await projectRepository.updateProject(project);
            if(proj) {
                return proj;
            }
            throw new BadRequestError(`project ${project.name} does not exist`);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async repairProject(name: string): Promise<Project> {
        let logger = getLogger('psvc-repair-project');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const project = await projectRepository.findProjectByName(name);

            // TODO - invoke kubernetes to repair project
            await controllerService.repairProject(project);

            return project;
        } catch (err:any) {
            logger.err(err);
            throw err;
        }
    }

    async deleteProject(projectId: string): Promise<Project> {
        let logger = getLogger('psvc-delete-project');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const project = await projectRepository.findProject(projectId);

            // TODO - invoke kubernetes to delete project.
            await controllerService.deleteProject(project);

            project.status = StatusType.deleted;
            await projectRepository.updateProject(project);

            return project;
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async purgeProject(projectId: string): Promise<void> {
        let logger = getLogger('psvc-purge-project');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            // TODO - validate project status is deleted
            const project = await projectRepository.findProject(projectId);
            if(project.status != StatusType.deleted) {

            }

            await projectRepository.deleteProject(projectId);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async updateProjectResource(projectId: string, resource: KubernetesResource): Promise<void> {
        let logger = getLogger('psvc-update-project-resource');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            if(resource.type === ResourceType.namespace) {
                const project = await projectRepository.findProject(projectId);
                project.status = resource.status;
                await projectRepository.updateProject(project);
            }

        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async createInstance(project: Project, request: InstanceRequest): Promise<Instance> {
        let logger = getLogger('psvc-purge-project');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            const projectId: string = project.id as string;
            const volumeType = request.volume?.type as VolumeType;
            const volumeSource = request.volume?.source as VolumeSourceType;
            const sourceName = request.volume?.instance as string;
            const sourceProject = request.volume?.project as string;
            const peers = request.peers as string[];

            const resourceRequest = createResourceRequest(request.type, volumeType, volumeSource, sourceName, sourceProject, peers);

            const instance = {name: request.name,
                type: request.type,
                project: project.id as string,
                description: request.description,
                request: resourceRequest,
                status: StatusType.new,
                state: StateType.new
            };
            
            const newInstance = await projectRepository.createInstance(projectId, instance)

//            const jobService = beanFactory.getJobService();
//            await jobService.createInstance(project, newInstance);

            // TODO - invoke k8s service to create instance
            const controllerService = beanFactory.getControllerService();
            await controllerService.createInstance(project, newInstance);

            return newInstance;
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async findAllInstances(params: QueryParam): Promise<Instance[]> {
        let logger = getLogger('psvc-find-all-instances');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            return await projectRepository.findInstances(params);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async findInstances(params: QueryParam): Promise<Instance[]> {
        let logger = getLogger('psvc-find-instances');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            return await projectRepository.findInstances(params);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async findInstance(instanceId: string): Promise<Instance> {
        let logger = getLogger('psvc-find-instance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            return await projectRepository.findInstance(instanceId);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async findInstanceByName(projectName: string, instanceName: string): Promise<Instance> {
        let logger = getLogger('psvc-find-instance-by-name');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            const project = await projectRepository.findProjectByName(projectName);
            if(project) {
                return await projectRepository.findInstanceByName(project.id as string, instanceName);
            }
            throw new ItemNotFoundError(ItemType.project, `project ${projectName} does not exist`);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }        
    }

    // update description, update request, update status
    async updateInstance(project: Project, instance: Instance, request: InstanceRequest): Promise<Instance> {
        let logger = getLogger('psvc-update-instance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            instance.request.peers = request.peers;

            const newInstance = await projectRepository.updateInstance(instance);
            await controllerService.updateInstance(project, instance);

            return newInstance;

        } catch (err: any) {
            logger.error(err);
            throw err;
        }
    }

    async repairInstance(projectName: string, instanceName: string): Promise<Instance> {
        let logger = getLogger('psvc-repair-instance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const project = await projectRepository.findProjectByName(projectName);
            if(project) {
                const instance = await projectRepository.findInstanceByName(project.id as string, instanceName);
                if(instance) {

                    await controllerService.repairInstance(project, instance);

                    //instance.status = StatusType.pending;
                    //await projectRepository.updateInstance(instance);

                    return instance;
                }

                throw new ItemNotFoundError(ItemType.instance, `instance ${instanceName} does not exist`);
            }

            throw new ItemNotFoundError(ItemType.project, `project ${projectName} does not exist`);

        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async startInstance(projectName: string, instanceName: string): Promise<Instance> {
        let logger = getLogger('psvc-start-instance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const project = await projectRepository.findProjectByName(projectName);
            if(project) {
                const instance = await projectRepository.findInstanceByName(project.id as string, instanceName);
                if(instance) {

                    if(instance.state == StateType.stopping) { // throw BadRequest error - stopping in progress
                        throw new BadRequestError('instance is currently stopping');
                    } else if(instance.state == StateType.starting) { // throw BadRequest error - already starting
                        throw new BadRequestError('instance is currently starting');
                    } else if(instance.state === StateType.running) { // throw BadRequest error - already stopped
                        throw new BadRequestError('instance is currently running');
                    }

                    logger.info(`starting instance - ${instanceName}`);
                    await controllerService.startInstance(project, instance);

                    instance.state = StateType.starting;
                    await projectRepository.updateInstance(instance);

                    return instance;
                }

                throw new ItemNotFoundError(ItemType.instance, `instance ${instanceName} does not exist`);
            }

            throw new ItemNotFoundError(ItemType.project, `project ${projectName} does not exist`);
            
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async stopInstance(projectName: string, instanceName: string): Promise<Instance> {
        let logger = getLogger('psvc-stop-instance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const project = await projectRepository.findProjectByName(projectName);
            if(project) {
                const instance = await projectRepository.findInstanceByName(project.id as string, instanceName);
                if(instance) {

                    if(instance.state == StateType.stopping) { // throw BadRequest error - already stopping
                        throw new BadRequestError(`instance is currently stopping`);
                    } else if(instance.state == StateType.starting) { // throw BadRequest error - starting in progress
                        throw new BadRequestError('instance is currently starting');
                    } else if(instance.state === StateType.stopped) { // throw BadRequest error -  already stopped
                        throw new BadRequestError('instance is currently stopped');
                    }

                    logger.info(`stopping instance - ${instanceName}`);
                    await controllerService.stopInstance(project, instance);

                    instance.state = StateType.stopping
                    return await projectRepository.updateInstance(instance);
                }
                throw new ItemNotFoundError(ItemType.instance, `instance ${instanceName} does not exist`);
            }
            throw new ItemNotFoundError(ItemType.project, `project ${projectName} does not exist`);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async createInstanceSnapshot(projectName: string, instanceName: string): Promise<Instance> {
        let logger = getLogger('psvc-create-instance-snapshot');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const project = await projectRepository.findProjectByName(projectName);
            if(project) {
                const instance = await projectRepository.findInstanceByName(project.id as string, instanceName);
                if(instance) {
                    await controllerService.createInstanceSnapshot(project, instance);

                    return instance;
                }
                throw new ItemNotFoundError(ItemType.instance, `instance ${instanceName} does not exist`);
            }
            throw new ItemNotFoundError(ItemType.project, `project ${projectName} does not exist`);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async createInstanceSnapshotSchedule(projectName: string, instanceName: string, request: SnapshotScheduleRequest): Promise<Instance> {
        let logger = getLogger('psvc-create-instance-snapshot-schedule');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const project = await projectRepository.findProjectByName(projectName);
            if(project) {
                const instance = await projectRepository.findInstanceByName(project.id as string, instanceName);

                if(instance) {            
                    await controllerService.createInstanceSnapshotSchedule(project, instance, request);
                    return instance;
                }
                throw new ItemNotFoundError(ItemType.instance, `instance ${instanceName} does not exist`);
            }
            throw new ItemNotFoundError(ItemType.project, `project ${projectName} does not exist`);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async deleteInstance(projectName: string, instanceName: string): Promise<Instance> {
        let logger = getLogger('psvc-delete-instance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const project = await projectRepository.findProjectByName(projectName);
            if(project) {
                const instance = await projectRepository.findInstanceByName(project.id as string, instanceName);
                if(instance) {

                    if(instance.state === StateType.starting || instance.state == StateType.running || instance.state == StateType.stopping
                        || instance.state === StateType.deleting) {
                        throw new BadRequestError(`unable to delete instance in ${instance.state} state`);
                    } 

                    await controllerService.deleteInstance(projectName, instanceName);

                    //TODO - update instance status
                    instance.state = StateType.deleting;
                    return await projectRepository.updateInstance(instance);
                }
                throw new ItemNotFoundError(ItemType.instance, `instance ${instanceName} does not exist`);
            }
            throw new ItemNotFoundError(ItemType.project, `project ${projectName} does not exist`);

        } catch (err: any) {
            logger.error(err);
            throw err;
        }

    }

    async purgeInstance(projectName: string, instanceName: string): Promise<void> {
        let logger = getLogger('psvc-purge-instance');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            const project = await projectRepository.findProjectByName(projectName);
            if(project) {
                const instance = await projectRepository.findInstanceByName(project.id as string, instanceName);
                if(instance) {

                    if(instance.state != StateType.deleted) { // throw error - can only purge deleted instances
                        throw new BadRequestError(`only deleted instances can be purged`);
                    }

                    // verify instance is deleted
                    await projectRepository.deleteInstance(instance.id as string);
                }
                throw new ItemNotFoundError(ItemType.instance, `instance ${instanceName} does not exist`);
            }
            throw new ItemNotFoundError(ItemType.project, `project ${projectName} does not exist`);

         } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async getInstanceResources(projectName: string, instanceName: string): Promise<KubernetesResources> {
        let logger = getLogger('psvc-get-instance-resources');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            const project = await projectRepository.findProjectByName(projectName);
            if(project) {
                const instance = await projectRepository.findInstanceByName(project.id as string, instanceName);
                if(instance) {
                    return await projectRepository.getInstanceResources(instance.id as string);
                }
                throw new ItemNotFoundError(ItemType.instance, `instance ${instanceName} does not exist`);
            }
            throw new ItemNotFoundError(ItemType.project, `project ${projectName} does not exist`);
         } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async getInstanceResource(projectName: string, instanceName: string, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource> {
        let logger = getLogger('psvc-get-instance-resource');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            const project = await projectRepository.findProjectByName(projectName);
            if(project) {
                const instance = await projectRepository.findInstanceByName(project.id as string, instanceName);
                if(instance) {
                    return await projectRepository.getInstanceResource(instance.id as string, resourceType, resourceName);
                }
                throw new ItemNotFoundError(ItemType.instance, `instance ${instanceName} does not exist`);
            }
            throw new ItemNotFoundError(ItemType.project, `project ${projectName} does not exist`);
         } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async updateInstanceResource(projectName: string, instanceName: string, resource: KubernetesResource): Promise<KubernetesResource> {
        let logger = getLogger('psvc-update-instance-resource');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            const project = await projectRepository.findProjectByName(projectName);
            if(project) {
                const instance = await projectRepository.findInstanceByName(project.id as string, instanceName);
                if(instance) {
                    return await projectRepository.updateInstanceResource(instance.id as string, resource);
                }
                throw new ItemNotFoundError(ItemType.instance, `instance ${instanceName} does not exist`);
            }
            throw new ItemNotFoundError(ItemType.project, `project ${projectName} does not exist`);
         } catch (err: any) {
            logger.error(err);
            throw err;
        }
    }

    async deleteInstanceResource(projectName: string, instanceName: string, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource> {
        let logger = getLogger('psvc-delete-instance-resource');
        try {

            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();
            const project = await projectRepository.findProjectByName(projectName);
            if(project) {
                const instance = await projectRepository.findInstanceByName(project.id as string, instanceName);
                if(instance) {
                    const resource = await projectRepository.getInstanceResource(instance.id as string, resourceType, resourceName);
                    if(resource) {

                        // TODO - check status of resource before deleting ...

                        await controllerService.deleteInstanceResource(instance.project, instance.name, resource.type, resource.name);

                        // TODO - update resource to pending
                        resource.status = StatusType.pending;
                        return await projectRepository.updateInstanceResource(instance.id as string, resource);
                    }
                    throw new ItemNotFoundError( ItemType.resource, `instance ${instanceName} does not have ${resourceType} resource called ${resourceName}`);
                }
                throw new ItemNotFoundError(ItemType.instance, `instance ${instanceName} does not exist`);
            }
            throw new ItemNotFoundError(ItemType.project, `project ${projectName} does not exist`);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }
}

export default new DefaultProjectService();