import { ProjectRepository, ProjectService, ControllerService } from "../interfaces";
import { Project, QueryFilter, KubernetesResource, Instance, SnapshotScheduleRequest, KubernetesResources, ProjectRequest, QueryParam, InstanceRequest } from "../model/model";
import { ProjectFilterType, ResourceType, StateType, StatusType, VolumeSourceType, VolumeType } from "../model/zbi.enum";
import { getLogger } from "../libs/logger"
import beanFactory from "../factory/bean.factory";
import { createResourceRequest } from "../libs/projects";
import { ServiceError, ItemNotFoundError, BadRequestError, ItemType, DataError } from "../libs/errors";

class DefaultProjectService implements ProjectService {

    async createProject(projectRequest: ProjectRequest): Promise<Project> {
        let logger = getLogger('psvc-create-project');
        try {

            logger.info(`project request = ${JSON.stringify(projectRequest)}`);

            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            // TODO - validate project

            const project = await projectRepository.createProject(projectRequest);
            if(project) {
                await controllerService.createProject(project);
                return project;
            } else {
                throw new BadRequestError('unable to create project');
            }
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
            throw new BadRequestError(`unable to update project`);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async repairProject(project: Project): Promise<Project> {
        let logger = getLogger('psvc-repair-project');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            await controllerService.repairProject(project);
            project.status = StatusType.pending;
            return await projectRepository.updateProject(project);
        } catch (err:any) {
            logger.err(err);
            throw err;
        }
    }

    async deleteProject(project: Project): Promise<Project> {
        let logger = getLogger('psvc-delete-project');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            if(project.status === StatusType.deleted) {
               throw new BadRequestError('project is already deleted');
            } else if(project.status === StatusType.pending) {
                throw new BadRequestError('project status is pending');
            }

            await controllerService.deleteProject(project);

            project.status = StatusType.deleted;
            return await projectRepository.updateProject(project);

        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async purgeProject(project: Project): Promise<void> {
        let logger = getLogger('psvc-purge-project');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            if(project.status != StatusType.deleted) {
                throw new BadRequestError("cannot purge project");
            }

            await projectRepository.deleteProject(project.id as string);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async updateProjectResource(project: Project, resource: KubernetesResource): Promise<void> {
        let logger = getLogger('psvc-update-project-resource');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            if(resource.type === ResourceType.namespace) {
                project.status = resource.status;
                await projectRepository.updateProject(project);
            }
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async createInstance(project: Project, request: InstanceRequest): Promise<Instance> {
        let logger = getLogger('psvc-create-instance');
        try {

            let sourceProject = project.name, sourceName = "", snapshot = "";
            if( request.volume?.source === VolumeSourceType.volume) {
                const instance = await this.findInstance(request.volume?.instance as string);
                sourceName = instance.id as string;
            } else if( request.volume?.source === VolumeSourceType.snapshot ) {
                sourceName = request.volume.snapshot as string;
            }

            const projectRepository = beanFactory.getProjectRepository();

            const projectId: string = project.id as string;
            const volumeType = request.volume?.type as VolumeType;
            const volumeSource = request.volume?.source as VolumeSourceType;
            const peers = request.peers as string[];
            const properties = request.properties;

            const resourceRequest = createResourceRequest(request.type, volumeType, volumeSource, sourceName, sourceProject, peers, properties);

            const instance = {name: request.name,
                type: request.type,
                project: project.id as string,
                description: request.description,
                request: resourceRequest,
                status: StatusType.new,
                state: StateType.new
            };
            
            const newInstance = await projectRepository.createInstance(projectId, instance)

            if(newInstance) {
                const controllerService = beanFactory.getControllerService();
                await controllerService.createInstance(project, newInstance);

                return newInstance;
            } else {
                throw new BadRequestError("unable to create instance");
            }
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
            throw new ItemNotFoundError(ItemType.project, `project not found`);
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
            if(newInstance) {
                await controllerService.updateInstance(project, instance);

                return newInstance;
            } else {
                throw new BadRequestError("unable to update instance");
            }
        } catch (err: any) {
            logger.error(err);
            throw err;
        }
    }

    async repairInstance(project: Project, instance: Instance): Promise<Instance> {
        let logger = getLogger('psvc-repair-instance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            await controllerService.repairInstance(project, instance);

            instance.state = StateType.pending;
            await projectRepository.updateInstance(instance);

            return instance;

        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async startInstance(project: Project, instance: Instance): Promise<Instance> {
        let logger = getLogger('psvc-start-instance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            if(instance.state == StateType.stopping) { // throw BadRequest error - stopping in progress
                throw new BadRequestError('instance is currently stopping');
            } else if(instance.state == StateType.starting) { // throw BadRequest error - already starting
                throw new BadRequestError('instance is currently starting');
            } else if(instance.state === StateType.running) { // throw BadRequest error - already stopped
                throw new BadRequestError('instance is currently running');
            }

            logger.info(`starting instance - ${instance.name}`);
            await controllerService.startInstance(project, instance);

            instance.state = StateType.starting;
            await projectRepository.updateInstance(instance);

            return instance;
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async stopInstance(project: Project, instance: Instance): Promise<Instance> {
        let logger = getLogger('psvc-stop-instance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            if(instance.state == StateType.stopping) { // throw BadRequest error - already stopping
                throw new BadRequestError(`instance is currently stopping`);
            } else if(instance.state == StateType.starting) { // throw BadRequest error - starting in progress
                throw new BadRequestError('instance is currently starting');
            } else if(instance.state === StateType.stopped) { // throw BadRequest error -  already stopped
                throw new BadRequestError('instance is currently stopped');
            }

            logger.info(`stopping instance - ${instance.id}`);
            await controllerService.stopInstance(project, instance);

            instance.state = StateType.stopping
            return await projectRepository.updateInstance(instance);

        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async createInstanceSnapshot(project: Project, instance: Instance): Promise<Instance> {
        let logger = getLogger('psvc-create-instance-snapshot');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            // TODO - get the resource back from k8s
            await controllerService.createInstanceSnapshot(project, instance);
            return instance;
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async createInstanceSnapshotSchedule(project: Project, instance: Instance, request: SnapshotScheduleRequest): Promise<Instance> {
        let logger = getLogger('psvc-create-instance-snapshot-schedule');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            // TODO - get resource back from k8s
            await controllerService.createInstanceSnapshotSchedule(project, instance, request);
            return instance;
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async deleteInstance(project: Project, instance: Instance): Promise<Instance> {
        let logger = getLogger('psvc-delete-instance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();


            if(instance.state === StateType.starting || instance.state == StateType.running || instance.state == StateType.stopping
                || instance.state === StateType.deleting) {
                throw new BadRequestError(`unable to delete instance in ${instance.state} state`);
            } 

            await controllerService.deleteInstance(project.name, instance.name);

            instance.state = StateType.deleting;
            return await projectRepository.updateInstance(instance);

        } catch (err: any) {
            logger.error(err);
            throw err;
        }

    }

    async purgeInstance(project: Project, instance: Instance): Promise<void> {
        let logger = getLogger('psvc-purge-instance');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            if(instance.state != StateType.deleted) { // throw error - can only purge deleted instances
                throw new BadRequestError(`project not yet deleted`);
            }

            await projectRepository.deleteInstance(instance.id as string);

         } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async getInstanceResources(project: Project, instance: Instance): Promise<KubernetesResources> {
        let logger = getLogger('psvc-get-instance-resources');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            return await projectRepository.getInstanceResources(instance.id as string);
         } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async getInstanceResource(project: Project, instance: Instance, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource> {
        let logger = getLogger('psvc-get-instance-resource');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            return await projectRepository.getInstanceResource(instance.id as string, resourceType, resourceName);
         } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }

    async updateInstanceResource(project: Project, instance: Instance, resource: KubernetesResource): Promise<KubernetesResource> {
        let logger = getLogger('psvc-update-instance-resource');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            return await projectRepository.updateInstanceResource(instance.id as string, resource);
         } catch (err: any) {
            logger.error(err);
            throw err;
        }
    }

    async deleteInstanceResource(project: Project, instance: Instance, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource> {
        let logger = getLogger('psvc-delete-instance-resource');
        try {

            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();
            const resource = await projectRepository.getInstanceResource(instance.id as string, resourceType, resourceName);
            if(resource) {

                // TODO - check status of resource before deleting ...

                await controllerService.deleteInstanceResource(instance.project, instance.name, resource.type, resource.name);

                // TODO - update resource to pending
                resource.status = StatusType.pending;
                return await projectRepository.updateInstanceResource(instance.id as string, resource);
            }
            throw new ItemNotFoundError( ItemType.resource, `instance resource not found`);
        } catch (err:any) {
            logger.error(err);
            throw err;
        }
    }
}

export default new DefaultProjectService();