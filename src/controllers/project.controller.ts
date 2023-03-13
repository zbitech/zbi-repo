import { getCurrentUser} from '../libs/context';
import {Request, Response} from 'express';
import beanFactory from '../factory/bean.factory';
import { Project, ProjectRequest } from '../model/model';
import { UserService, ProjectService } from "../interfaces";
import { getLogger } from '../libs/logger';
import { HttpStatusCode } from 'axios';

export default class ProjectController {

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



}


// const auth = {
//     "payload":
//         {
//             "iss":"https://dev-18udhi373ksoxehw.us.auth0.com/",
//             "sub":"auth0|63c1f98db4b6a8f1c1dacbf3",
//             "aud":"https://zbi-control-plane",
//             "iat":1675271293,
//             "exp":1675357693,
//             "azp":"IcSZP96JQeDDGrckbjN1S6bAf9YAg2ua",
//             "scope":"read:project create:project update:project delete:project read:instance create:instance delete:instance update:instance",
//             "gty":"password"
//         },
//         "header":{"alg":"RS256","typ":"JWT","kid":"3O0ERSgekUG0WqhqUp6Z6"},
//         "token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNPMEVSU2dla1VHMFdxaHFVcDZaNiJ9.eyJpc3MiOiJodHRwczovL2Rldi0xOHVkaGkzNzNrc294ZWh3LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2M2MxZjk4ZGI0YjZhOGYxYzFkYWNiZjMiLCJhdWQiOiJodHRwczovL3piaS1jb250cm9sLXBsYW5lIiwiaWF0IjoxNjc1MjcxMjkzLCJleHAiOjE2NzUzNTc2OTMsImF6cCI6IkljU1pQOTZKUWVEREdyY2tiak4xUzZiQWY5WUFnMnVhIiwic2NvcGUiOiJyZWFkOnByb2plY3QgY3JlYXRlOnByb2plY3QgdXBkYXRlOnByb2plY3QgZGVsZXRlOnByb2plY3QgcmVhZDppbnN0YW5jZSBjcmVhdGU6aW5zdGFuY2UgZGVsZXRlOmluc3RhbmNlIHVwZGF0ZTppbnN0YW5jZSIsImd0eSI6InBhc3N3b3JkIn0.PXFe2EVFGe3oMfZENaxxNRHVX0X0-JHNSxWH2IYeUHVWVKG63k5_M1NqBgtHyMoSp1WHtEG6RZiOcI5E53UVs_EjhbF5r8vyK7_My92ajIkRKCREx2-Fn17kNcIDQMYP1R0sKoyG0VBqpbeWGyjyWfqJapVgk4FsHCy_x1BcZifuIKX7lsNmmi9HUBuEz2sumDF4l0ffARnNaWdIhl8PgnFoimxxn3o6r1lCwBU8ilsqXM-KxIScMGqvdaXbDvaJmbd0z2nAEhNrBAcq0FxFiR-ZrKhHzExlfi37mjMhALZ7XJaOCIyUaaV4cGMT-6jp0ZmJXtENGI3cG6R6kXQ1dg"
//     };
