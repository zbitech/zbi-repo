import { getCurrentUser} from '../libs/context';
import {Request, Response} from 'express';
import beanFactory from '../factory/bean.factory';
import { Project, ProjectRequest } from '../model/model';
import { UserService, ProjectService } from "../interfaces";
import { getLogger } from '../libs/logger';
import { HttpStatusCode } from 'axios';

class ProjectController {

    constructor() {
    }

    async createProject(request: Request, response: Response): Promise<void> {
        let projectService: ProjectService = beanFactory.getService("project");
        let logger = getLogger('pc.createProject');

        try {
            logger.info(`headers: ${JSON.stringify(request.auth)}`);
            const projectRequest: ProjectRequest = request.body;
            projectRequest.owner = getCurrentUser();

            logger.info(`create request: ${JSON.stringify(projectRequest)}`);

            const project: Project = await projectService.createProject(projectRequest)
            response.status(HttpStatusCode.Created).json(project);
        } catch (err:any) {
            logger.error(`failed to create project: ${err}`)
            response.status(500).json({message: err.message});            
        }
    }

    async findProjects(request: Request, response: Response): Promise<void> {
        let projectService: ProjectService = beanFactory.getService("project");
        let logger = getLogger('pc.findProjects');

        try {
            
            response.status(HttpStatusCode.Ok).json();
        } catch (err:any) {
            logger.error(`failed to create project: ${err}`)
            response.status(500).json({message: err.message});
        }

    }

    async findProject(request: Request, response: Response): Promise<void> {

    }

    async updateProject(request: Request, response: Response): Promise<void> {

    }

    async repairProject(request: Request, response: Response): Promise<void> {

    }

    async deleteProject(request: Request, response: Response): Promise<void> {

    }

    async purgeProject(request: Request, response: Response): Promise<void> {

    }

    async updateProjectResource(request: Request, response: Response): Promise<void> {

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

    }

    async findAllInstances(request: Request, response: Response): Promise<void> {

    }
    
    async findInstances(request: Request, response: Response): Promise<void> {

    }

    async findInstance(request: Request, response: Response): Promise<void> {

    }

    async updateInstance(request: Request, response: Response): Promise<void> {

    }
    
    async repairInstance(request: Request, response: Response): Promise<void> {

    }

    // op - start, stop, backup, schedule
    async operateInstance(request: Request, response: Response): Promise<void> {

    }

    async deleteInstance(request: Request, response: Response): Promise<void> {

    }

    async purgeInstance(request: Request, response: Response): Promise<void> {

    }


    async getInstanceResources(request: Request, response: Response): Promise<void> {

    }

    async getInstanceResource(request: Request, response: Response): Promise<void> {

    }

    async updateInstanceResource(request: Request, response: Response): Promise<void> {

    }

    async deleteInstanceResource(request: Request, response: Response): Promise<void> {

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