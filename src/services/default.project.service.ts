import { ProjectRepository, ProjectService, ControllerService } from "../interfaces";
import { Project, QueryFilter, KubernetesResource, Instance, SnapshotScheduleRequest, KubernetesResources } from "../model/model";
import { ProjectFilterType, ResourceType, StatusType } from "../model/zbi.enum";
import { getLogger } from "../logger"

export default class DefaultProjectService implements ProjectService {

    private projectRepository: ProjectRepository;
    private controllerService: ControllerService;

    constructor(projectRepository: ProjectRepository, controllerService: ControllerService) {
        this.projectRepository = projectRepository;
        this.controllerService = controllerService;
    }
    
    async createProject(project: Project): Promise<Project> {
        let logger = getLogger('psvc.createProject');
        try {
            // TODO - validate project

            const newProject = await this.projectRepository.createProject(project);

            await this.controllerService.createProject(newProject);

            return newProject;
        } catch (err) {
            throw err;            
        }
    }

    async findProjects(filter: QueryFilter): Promise<Project[]> {
        let logger = getLogger('psvc.findProjects');
        try {

            const param:ProjectFilterType = filter.name as ProjectFilterType;
            const p:any = {};
            p[param] = filter.value; 
            
            return await this.projectRepository.findProjects(p, filter.itemsPerPage, filter.page);
        } catch (err) {
            throw err;
        }
    }

    async findProject(projectId: string): Promise<Project> {
        let logger = getLogger('psvc.findProject');
        try {
            return await this.projectRepository.findProject(projectId);
        } catch (err) {
            throw err;
        }
    }

    async updateProject(project: Project): Promise<Project> {
        let logger = getLogger('psvc.updateProject');
        try {
            // TODO - validate update
 
            return this.projectRepository.updateProject(project);
        } catch (err) {
            throw err;
        }
    }

    async repairProject(projectId: string): Promise<Project> {
        let logger = getLogger('psvc.repairProject');
        try {
            const project = await this.projectRepository.findProject(projectId);

            // TODO - invoke kubernetes to repair project
            await this.controllerService.repairProject(project);

            return project;
        } catch (err) {
            throw err;
        }
    }

    async deleteProject(projectId: string): Promise<Project> {
        let logger = getLogger('psvc.deleteProject');
        try {
            const project = await this.projectRepository.findProject(projectId);

            // TODO - invoke kubernetes to delete project.
            await this.controllerService.deleteProject(project);

            project.status = StatusType.deleted;
            await this.projectRepository.updateProject(project);

            return project;
        } catch (err) {
            throw err;
        }
    }

    async purgeProject(projectId: string): Promise<void> {
        let logger = getLogger('psvc.purgeProject');
        try {
            // TODO - validate project status is deleted
            const project = await this.projectRepository.findProject(projectId);

            await this.projectRepository.deleteProject(projectId);
        } catch (err) {
            throw err;
        }
    }

    async updateProjectResource(projectId: string, resource: KubernetesResource): Promise<void> {
        let logger = getLogger('psvc.updateProjectResource');
        try {
            if(resource.type === ResourceType.namespace) {
                const project = await this.projectRepository.findProject(projectId);
                project.status = resource.status;
                await this.projectRepository.updateProject(project);
            }
        } catch (err) {
            throw err;
        }
    }

    async createInstance(project: Project, instance: Instance): Promise<Instance> {
        let logger = getLogger('psvc.purgeProject');
        try {
            const projectId: string = project.id as string;
            const newInstance = this.projectRepository.createInstance(projectId, instance)

            // TODO - invoke k8s service to create instance
            await this.controllerService.createInstance(project, instance);

            return newInstance;
        } catch (err) {
            throw err;
        }
    }

    async findAllInstances(): Promise<Instance[]> {
        let logger = getLogger('psvc.findAllInstances');
        try {
            return await this.projectRepository.findInstances({});
        } catch (err) {
            throw err;
        }
    }

    async findInstances(params: QueryFilter): Promise<Instance[]> {
        let logger = getLogger('psvc.findInstances');
        try {
            return await this.projectRepository.findInstances({});
        } catch (err) {
            throw err;
        }
    }

    async findInstance(instanceId: string): Promise<Instance> {
        let logger = getLogger('psvc.findInstance');
        try {
            return await this.projectRepository.findInstance(instanceId);
        } catch (err) {
            throw err;
        }
    }

    // update description, update request, update status
    async updateInstance(instanceId: string, instance: Instance): Promise<Instance> {
        let logger = getLogger('psvc.updateInstance');
        try {
            return await this.projectRepository.updateInstance(instance);
        } catch (err) {
            throw err;
        }
    }

    async repairInstance(instanceId: string): Promise<Instance> {
        let logger = getLogger('psvc.repairInstance');
        try {
            const instance = await this.projectRepository.findInstance(instanceId);

            //this.controllerService.repairInstance()
            return instance;
        } catch (err) {
            throw err;
        }
    }

    async startInstance(instanceId: string): Promise<void> {
        let logger = getLogger('psvc.startInstance');
        try {
            const instance = await this.projectRepository.findInstance(instanceId);

            await this.controllerService.startInstance(instance.project, instance.name)
        } catch (err) {
            throw err;
        }
    }

    async stopInstance(instanceId: string): Promise<void> {
        let logger = getLogger('psvc.stopInstance');
        try {
            const instance = await this.projectRepository.findInstance(instanceId);

            await this.controllerService.stopInstance(instance.project, instance.name)
        } catch (err) {
            throw err;
        }
    }

    async createInstanceBackup(instanceId: string): Promise<void> {
        let logger = getLogger('psvc.createInstanceBackup');
        try {
            const instance = await this.projectRepository.findInstance(instanceId);

            await this.controllerService.createInstanceBackup(instance.project, instance.name);
        } catch (err) {
            throw err;
        }
    }

    async createInstanceBackupSchedule(instanceId: string, request: SnapshotScheduleRequest): Promise<void> {
        let logger = getLogger('psvc.createInstanceBackupSchedule');
        try {
            const instance = await this.projectRepository.findInstance(instanceId);

            //this.controllerService?.repairInstance()
        } catch (err) {
            throw err;
        }
    }

    async deleteInstance(instanceId: string): Promise<void> {
        let logger = getLogger('psvc.deleteInstance');
        try {
            const instance = await this.projectRepository.findInstance(instanceId);


            //this.controllerService?.repairInstance()
        } catch (err) {
            throw err;
        }

    }

    async purgeInstance(instanceId: string): Promise<void> {
        let logger = getLogger('psvc.purgeInstance');
        try {
            const instance = await this.projectRepository.findInstance(instanceId)
            // verify instance is deleted

            await this.projectRepository.deleteInstance(instanceId);
         } catch (err) {
            throw err;
        }
    }

    async getInstanceResources(instanceId: string): Promise<KubernetesResources> {
        let logger = getLogger('psvc.getInstanceResources');
        try {
            return await this.projectRepository.getInstanceResources(instanceId)
         } catch (err) {
            throw err;
        }
    }

    async getInstanceResource(instanceId: string, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource> {
        let logger = getLogger('psvc.getInstanceResource');
        try {
            return await this.projectRepository.getInstanceResource(instanceId, resourceType, resourceName);
         } catch (err) {
            throw err;
        }
    }

    async updateInstanceResource(instanceId: string, resource: KubernetesResource, update: Date): Promise<KubernetesResource> {
        let logger = getLogger('psvc.updateInstanceResource');
        try {
            return await this.projectRepository.updateInstanceResource(instanceId, resource, update);
         } catch (err) {
            throw err;
        }
    }

    async deleteInstanceResource(instanceId: string, resourceType: ResourceType, resourceName: string): Promise<void> {
        let logger = getLogger('psvc.deleteInstanceResource');
        try {

            const instance = await this.projectRepository.findInstance(instanceId)
            const resource = await this.projectRepository.getInstanceResource(instanceId, resourceType, resourceName);
          
            await this.controllerService.deleteInstanceResource(instance.project, instance.name, resource.type, resource.name);
        } catch (err) {
            throw err;
        }
    }
}