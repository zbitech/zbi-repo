import {Request, Response} from 'express';
import { IAMService, ProjectService } from "src/interfaces";

export default class ProjectController {

    constructor() {
    }

    async createProject(request: Request, response: Response): Promise<void> {

    }

    async findProjects(request: Request, response: Response): Promise<void> {

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