import { getCurrentUser} from '../libs/context';
import {Request, Response} from 'express';
import beanFactory from '../factory/bean.factory';
import projectValidator from '../services/project.validator.service';
import { Instance, InstanceRequest, KubernetesResource, Project, ProjectRequest, SnapshotScheduleRequest } from '../model/model';
import { ProjectService } from "../interfaces";
import { getLogger } from '../libs/logger';
import { HttpStatusCode } from 'axios';
import { FilterConditionType, InstanceFilterType, ProjectFilterType, ResourceType } from '../model/zbi.enum';
import { handleError } from '../libs/errors';

class ProjectController {

    constructor() {
    }

    async createProject(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-create-project');

        try {
            let projectService: ProjectService = beanFactory.getProjectService();
            const projectRequest: ProjectRequest = request.body;
            projectRequest.owner = response.locals.subject.userid;

            logger.info(`project request: ${JSON.stringify(projectRequest)}`);

            await projectValidator.validateProjectRequest(response.locals.subject, projectRequest);
            const project: Project = await projectService.createProject(projectRequest)
            response.status(HttpStatusCode.Created).json(project);
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }
    }

    async findProjects(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-find-projects');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

            const name = request.query.name as ProjectFilterType;
            const value = request.query.value as string;
            const param = name ? {name, condition: FilterConditionType.equal, value: value} : {};

            logger.info(`request - ${JSON.stringify(param)}`);
            const projects = await projectService.findProjects(param);

            response.status(HttpStatusCode.Ok).json({projects});
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }

    }

    async findProject(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-find-project');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

            const id = request.params.project;
            logger.info(`project id: ${id}`);

            const project = await projectService.findProject(id);
            if(project) {
                response.status(HttpStatusCode.Ok).json({project});
            } else {
                response.status(HttpStatusCode.NotFound).json({message: `project not found`});
            }
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }

    }

    async updateProject(request: Request, response: Response): Promise<void> {

    }

    async repairProject(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-repair-project');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

            const id = request.params.project;
            logger.info(`project id: ${id}`);
            let project = await projectService.findProject(id);
            if(project) {
                project = await projectService.repairProject(project);
                if(project) {
                    response.status(HttpStatusCode.Ok).json({project});
                } else {
                    response.status(HttpStatusCode.BadRequest).json({message: `unable to repair project`});
                }
            } else {
                response.status(HttpStatusCode.NotFound).json({message: `project not found`});
            }     
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }
    }

    async deleteProject(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-delete-project');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

            const id = request.params.project;
            logger.info(`project: ${id}`);

            let project = await projectService.findProject(id);
            if(project) {
                project = await projectService.deleteProject(project);
                if(project) {
                    response.status(HttpStatusCode.Ok).json({project});
                } else {
                    response.status(HttpStatusCode.BadRequest).json({message: `unable to delete project`});
                }
            } else {
                response.status(HttpStatusCode.NotFound).json({message: `project not found`});
            }
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }
 
    }

    async purgeProject(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-purge-project');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

            const id = request.params.project;
            logger.info(`searching for project: ${id}`);

            let project = await projectService.findProject(id);
            if(project) {
                await projectService.purgeProject(project);
                response.sendStatus(HttpStatusCode.Ok);
            } else {
                response.status(HttpStatusCode.NotFound).json({message: `project not found`});
            }
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }

    }

    async updateProjectResource(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-update-project-resource');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

            const id = request.params.project;
            logger.info(`project name: ${id}`);

            let project = await projectService.findProject(id);
            if(project) {
                project = await projectService.repairProject(project);
                response.status(HttpStatusCode.Ok).json({project});
            } else {
                response.status(HttpStatusCode.NotFound).json({message: `project not found`});
            }
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }
 
    }

    async findProjectJobs(request: Request, response: Response): Promise<void> {

    }

    async findProjectJob(request: Request, response: Response): Promise<void> {
        
    }

    async updateProjectJob(request: Request, response: Response): Promise<void> {
        
    }

    async deleteProjectJob(request: Request, response: Response): Promise<void> {
        
    }

    async createInstance(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-create-instance');

        try {
            let projectService: ProjectService = beanFactory.getProjectService();
            const projectId = request.params.project;

            const project = await projectService.findProject(projectId);
            const instanceRequest: InstanceRequest = request.body;
            logger.info(`project name = ${project.name}, instance = ${JSON.stringify(instanceRequest)}`);

            const instance = await projectService.createInstance(project, instanceRequest);
            if(instance) {
                response.status(HttpStatusCode.Ok).json({instance});
            } else {
                response.status(HttpStatusCode.InternalServerError).json({message: `failed to create instance`});
            }
        } catch (err: any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }
    }

    async findAllInstances(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-find-all-instances');

    }
    
    async findInstances(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-find-instances');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

            let projectId = request.params.project;
            //const project = await projectService.findProject(projectId);

            const param = {name: InstanceFilterType.project, condition: FilterConditionType.equal, value: projectId};
            logger.info(`query parameter = ${JSON.stringify(param)}`);

            const instances = await projectService.findInstances(param);
            response.status(HttpStatusCode.Ok).json({instances});

        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }
    }

    async findInstance(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-find-instance');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

//            let projectName = request.params.project;
            let instanceId = request.params.instance;

            logger.info(`instance: ${instanceId}`);
            const instance = await projectService.findInstance(instanceId);

            if(instance) {
                logger.info(`found instance - ${JSON.stringify(instance)}`);
                response.status(HttpStatusCode.Ok).json({instance});
            } else {
                response.sendStatus(HttpStatusCode.NotFound).json({message: `failed to find instance ${instanceId}`});
            }
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }
    }

    async updateInstance(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-update-instance');

        try {
            let projectService: ProjectService = beanFactory.getProjectService();
//            const projectName = request.params.project;
            const instanceId = request.params.instance;

            let instance = await projectService.findInstance(instanceId);
            if(instance) {
                const project = await projectService.findProjectByName(instance.project);
                const instanceRequest: InstanceRequest = request.body;
                logger.info(`project name = ${project.name}, instance = ${instance.name}, request = ${JSON.stringify(instanceRequest)}`);

                instance = await projectService.updateInstance(project, instance, instanceRequest);
                if(instance) {
                    response.status(HttpStatusCode.Ok).json({instance});
                } else {
                    response.status(HttpStatusCode.InternalServerError).json({message: `failed to create instance`});
                }
            } else {
                response.status(HttpStatusCode.NotFound).json({message: `instance not found`});
            }
        } catch (err: any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }
    }
    
    async repairInstance(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-find-instance');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

//            let projectName = request.params.project;
            let instanceId = request.params.instance;
            let instance = await projectService.findInstance(instanceId);
            if(instance) {
                const project = await projectService.findProjectByName(instance.project);
                instance = await projectService.repairInstance(project, instance);
                if(instance) {
                    response.status(HttpStatusCode.Ok).json({instance});
                } else {
                    response.status(HttpStatusCode.BadRequest).json({message: `request is not valid`});
                }
            } else {
                response.status(HttpStatusCode.NotFound).json({message: `instance not found`});
            }
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }
    }

    // op - start, stop, backup, schedule
    async operateInstance(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-operate-instance');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

//            let projectName = request.params.project;
            let instanceId = request.params.instance;
            let op = request.body.op;

            let instance = await projectService.findInstance(instanceId);
            if(instance) {
                const project = await projectService.findProjectByName(instance.project);
                logger.info(`project = ${project.name}, instance = ${instance.name}, ${JSON.stringify(request.body)}`);
                if( op === "start") {
                    instance = await projectService.startInstance(project, instance);
                    response.status(HttpStatusCode.Ok).json({instance});
                } else if( op === "stop" ) {
                    instance = await projectService.stopInstance(project, instance);
                    response.status(HttpStatusCode.Ok).json({instance});
                } else if( op === "snapshot" ) {
                    instance = await projectService.createInstanceSnapshot(project, instance);
                    response.status(HttpStatusCode.Ok).json({instance});
                } else if( op === "schedule" ) { 
                    let scheduleRequest:SnapshotScheduleRequest = request.body.schedule;
                    instance = await projectService.createInstanceSnapshotSchedule(project, instance, scheduleRequest);
                    response.status(HttpStatusCode.Ok).json({instance});
                } else if(op === "rotate") {

                } else {
                    response.status(HttpStatusCode.BadRequest).json({message: `${op} is not a valid operation`});
                }
            } else {
                response.status(HttpStatusCode.NotFound).json({message: `instance not found`});
            }

        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }

    }

    async deleteInstance(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-delete-instance');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

//            let projectName = request.params.project;
            let instanceId = request.params.instance;
            let instance = await projectService.findInstance(instanceId);
            if(instance) {
                const project = await projectService.findProjectByName(instance.project);
                instance = await projectService.deleteInstance(project, instance);
                if( instance ) {
                    response.status(HttpStatusCode.Ok).json({instance});
                } else {
                    response.status(HttpStatusCode.BadRequest).json({message: `not a valid instance`});
                }
            } else {
                response.status(HttpStatusCode.NotFound).json({message: `instance not found`});
            }

        } catch (err:any) {
            logger.error(`failed to create project: ${err}`)
            response.status(500).json({message: err.message});
        }
    }

    async purgeInstance(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-purge-instance');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

//            let projectName = request.params.project;
            let instanceId = request.params.instance;
            let instance = await projectService.findInstance(instanceId);
            if(instance) {
                const project = await projectService.findProjectByName(instance.project);
                await projectService.purgeInstance(project, instance);
                response.status(HttpStatusCode.Ok).json();
            }else {
                response.status(HttpStatusCode.NotFound).json({message: `instance not found`});
            }
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }
    }


    async getInstanceResources(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-get-instance-resources');
        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();
//            let projectName = request.params.project;            
            let instanceId = request.params.instance;
            let instance = await projectService.findInstance(instanceId);

            if(instance) {
                const project = await projectService.findProjectByName(instance.project);
                const {type, name} = request.query;
                if(!type && !name) {
                    const resources = await projectService.getInstanceResources(project, instance);
                    response.status(HttpStatusCode.Ok).json({resources});
                } else {
                    const resource = await projectService.getInstanceResource(project, instance, type as ResourceType, name as string);
                    if(resource) {
                        response.status(HttpStatusCode.Ok).json(resource);
                    } else {
                        response.status(HttpStatusCode.NotFound).json({message: `invalid resource parameter`});
                    }
                }
            } else {
                response.status(HttpStatusCode.NotFound).json({message: `instance not found`});
            }
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }
    }

    async updateInstanceResource(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-update-instance-resource');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

//            let projectName = request.params.project;
            let instanceId = request.params.instance;
            let instance = await projectService.findInstance(instanceId);

            if(instance) {
                const project = await projectService.findProject(instance.project);
                let resource: KubernetesResource = request.body;
                logger.debug(`project: ${project.name}, instance: ${instance.name}, resource: ${JSON.stringify(resource)}`);
            
                resource = await projectService.updateInstanceResource(project, instance, resource);
                if(resource) {
                    response.status(HttpStatusCode.Ok).json({resource});
                } else {
                    response.status(HttpStatusCode.BadRequest).json({message: `instance ${instance.name} in project ${project.name} is not valid`});
                }
            } else {
                response.status(HttpStatusCode.NotFound).json({message: `instance not found`});
            }
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }

    }

    async deleteInstanceResource(request: Request, response: Response): Promise<void> {
        let logger = getLogger('pctrl-delete-instance-resource');

        try {
            
            let projectService: ProjectService = beanFactory.getProjectService();

//            let projectName = request.params.project;
            let instanceId = request.params.instance;
            let instance = await projectService.findInstance(instanceId);

            if(instance) {
                const project = await projectService.findProject(instance.project);
                const {type, name} = request.body;
                logger.info(`deleting resource: ${type}-${name} project: ${project.name}, instance: ${instance.name}`);
            
                const resource = await projectService.deleteInstanceResource(project, instance, type, name);
                if(resource) {
                    response.sendStatus(HttpStatusCode.Ok).json({resource});
                } else {
                    response.status(HttpStatusCode.BadRequest).json({message: `instance ${instance.name} in project ${project.name} is not valid`});
                }
            } else {
                response.status(HttpStatusCode.NotFound).json({message: `instance not found`});
            }
        } catch (err:any) {
            const result = handleError(err);
            logger.error(`response - ${JSON.stringify(result)}`);
            response.status(result.code).json({message: result.message});            
        }
    }

    async findInstanceJobs(request: Request, response: Response): Promise<void> {

    }

    async findInstanceJob(request: Request, response: Response): Promise<void> {
        
    }

    async updateInstanceJob(request: Request, response: Response): Promise<void> {
        
    }

    async deleteInstanceJob(request: Request, response: Response): Promise<void> {
        
    }


}

export default new ProjectController();