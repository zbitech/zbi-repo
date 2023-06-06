import { ProjectRepository, ProjectService, ControllerService } from "../interfaces";
import { Project, QueryFilter, KubernetesResource, Instance, SnapshotScheduleRequest, KubernetesResources, ProjectRequest, QueryParam } from "../model/model";
import { ProjectFilterType, ResourceType, StatusType } from "../model/zbi.enum";
import { getLogger } from "../libs/logger"
import beanFactory from "../factory/bean.factory";

class DefaultProjectService implements ProjectService {

    async createProject(project: ProjectRequest): Promise<Project> {
        let logger = getLogger('create-project-svc');
        try {
            logger.debug(`creating project => ${JSON.stringify(project)}`);
            const controllerService = beanFactory.getControllerService();
            const projectRepository = beanFactory.getProjectRepository();
            // TODO - validate project

            const newProject = await projectRepository.createProject(project);

            //await controllerService.createProject(newProject);

            return newProject;
        } catch (err) {
            throw err;            
        }
    }

    async findProjects(params: QueryParam, size: number, page: number): Promise<Project[]> {
        let logger = getLogger('psvc.findProjects');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            return await projectRepository.findProjects(params, size, page);
        } catch (err) {
            throw err;
        }
    }

    async findProject(projectId: string): Promise<Project> {
        let logger = getLogger('psvc.findProject');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            return await projectRepository.findProject(projectId);
        } catch (err) {
            throw err;
        }
    }

    async updateProject(project: Project): Promise<Project> {
        let logger = getLogger('psvc.updateProject');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            // TODO - validate update
 
            return projectRepository.updateProject(project);
        } catch (err) {
            throw err;
        }
    }

    async repairProject(projectId: string): Promise<Project> {
        let logger = getLogger('psvc.repairProject');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const project = await projectRepository.findProject(projectId);

            // TODO - invoke kubernetes to repair project
            await controllerService.repairProject(project);

            return project;
        } catch (err) {
            throw err;
        }
    }

    async deleteProject(projectId: string): Promise<Project> {
        let logger = getLogger('psvc.deleteProject');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const project = await projectRepository.findProject(projectId);

            // TODO - invoke kubernetes to delete project.
            await controllerService.deleteProject(project);

            project.status = StatusType.deleted;
            await projectRepository.updateProject(project);

            return project;
        } catch (err) {
            throw err;
        }
    }

    async purgeProject(projectId: string): Promise<void> {
        let logger = getLogger('psvc.purgeProject');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            // TODO - validate project status is deleted
            const project = await projectRepository.findProject(projectId);

            await projectRepository.deleteProject(projectId);
        } catch (err) {
            throw err;
        }
    }

    async updateProjectResource(projectId: string, resource: KubernetesResource): Promise<void> {
        let logger = getLogger('psvc.updateProjectResource');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            if(resource.type === ResourceType.namespace) {
                const project = await projectRepository.findProject(projectId);
                project.status = resource.status;
                await projectRepository.updateProject(project);
            }
        } catch (err) {
            throw err;
        }
    }

    async createInstance(project: Project, instance: Instance): Promise<Instance> {
        let logger = getLogger('psvc.purgeProject');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const projectId: string = project.id as string;
            const newInstance = projectRepository.createInstance(projectId, instance)

            // TODO - invoke k8s service to create instance
            await controllerService.createInstance(project, instance);

            return newInstance;
        } catch (err) {
            throw err;
        }
    }

    async findAllInstances(params: QueryParam, size: number, page: number): Promise<Instance[]> {
        let logger = getLogger('psvc.findAllInstances');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            return await projectRepository.findInstances(params);
        } catch (err) {
            throw err;
        }
    }

    async findInstances(params: QueryFilter): Promise<Instance[]> {
        let logger = getLogger('psvc.findInstances');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            return await projectRepository.findInstances(params);
        } catch (err) {
            throw err;
        }
    }

    async findInstance(instanceId: string): Promise<Instance> {
        let logger = getLogger('psvc.findInstance');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            return await projectRepository.findInstance(instanceId);
        } catch (err) {
            throw err;
        }
    }

    // update description, update request, update status
    async updateInstance(instanceId: string, instance: Instance): Promise<Instance> {
        let logger = getLogger('psvc.updateInstance');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            return await projectRepository.updateInstance(instance);
        } catch (err) {
            throw err;
        }
    }

    async repairInstance(instanceId: string): Promise<Instance> {
        let logger = getLogger('psvc.repairInstance');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            const instance = await projectRepository.findInstance(instanceId);

            //this.controllerService.repairInstance()
            return instance;
        } catch (err) {
            throw err;
        }
    }

    async startInstance(instanceId: string): Promise<void> {
        let logger = getLogger('psvc.startInstance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const instance = await projectRepository.findInstance(instanceId);
            const project = await projectRepository.findProjectByName(instance.name);

            await controllerService.startInstance(project, instance);
        } catch (err) {
            throw err;
        }
    }

    async stopInstance(instanceId: string): Promise<void> {
        let logger = getLogger('psvc.stopInstance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const instance = await projectRepository.findInstance(instanceId);
            const project = await projectRepository.findProjectByName(instance.name);

            await controllerService.stopInstance(project, instance);
        } catch (err) {
            throw err;
        }
    }

    async createInstanceBackup(instanceId: string): Promise<void> {
        let logger = getLogger('psvc.createInstanceBackup');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const instance = await projectRepository.findInstance(instanceId);
            const project = await projectRepository.findProjectByName(instance.name);

            await controllerService.createInstanceBackup(project, instance);
        } catch (err) {
            throw err;
        }
    }

    async createInstanceBackupSchedule(instanceId: string, request: SnapshotScheduleRequest): Promise<void> {
        let logger = getLogger('psvc.createInstanceBackupSchedule');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const instance = await projectRepository.findInstance(instanceId);
            const project = await projectRepository.findProjectByName(instance.name);

            await controllerService.createInstanceBackupSchedule(project, instance, request);
        } catch (err) {
            throw err;
        }
    }

    async deleteInstance(instanceId: string): Promise<void> {
        let logger = getLogger('psvc.deleteInstance');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const instance = await projectRepository.findInstance(instanceId);
            const project = await projectRepository.findProjectByName(instance.name);

            await controllerService.deleteInstanceResource
        } catch (err) {
            throw err;
        }

    }

    async purgeInstance(instanceId: string): Promise<void> {
        let logger = getLogger('psvc.purgeInstance');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            const instance = await projectRepository.findInstance(instanceId)
            // verify instance is deleted

            await projectRepository.deleteInstance(instanceId);
         } catch (err) {
            throw err;
        }
    }

    async getInstanceResources(instanceId: string): Promise<KubernetesResources> {
        let logger = getLogger('psvc.getInstanceResources');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            return await projectRepository.getInstanceResources(instanceId)
         } catch (err) {
            throw err;
        }
    }

    async getInstanceResource(instanceId: string, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource> {
        let logger = getLogger('psvc.getInstanceResource');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            return await projectRepository.getInstanceResource(instanceId, resourceType, resourceName);
         } catch (err) {
            throw err;
        }
    }

    async updateInstanceResource(instanceId: string, resource: KubernetesResource, update: Date): Promise<KubernetesResource> {
        let logger = getLogger('psvc.updateInstanceResource');
        try {
            const projectRepository = beanFactory.getProjectRepository();

            return await projectRepository.updateInstanceResource(instanceId, resource, update);
         } catch (err) {
            throw err;
        }
    }

    async deleteInstanceResource(instanceId: string, resourceType: ResourceType, resourceName: string): Promise<void> {
        let logger = getLogger('psvc.deleteInstanceResource');
        try {
            const projectRepository = beanFactory.getProjectRepository();
            const controllerService = beanFactory.getControllerService();

            const instance = await projectRepository.findInstance(instanceId)
            const resource = await projectRepository.getInstanceResource(instanceId, resourceType, resourceName);
          
            await controllerService.deleteInstanceResource(instance.project, instance.name, resource.type, resource.name);
        } catch (err) {
            throw err;
        }
    }
}

export default new DefaultProjectService();