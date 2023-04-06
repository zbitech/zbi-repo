import { getCurrentUser} from '../libs/context';
import {Request, Response} from 'express';
import beanFactory from '../factory/bean.factory';
import { Project, ProjectRequest } from '../model/model';
import { UserService, ProjectService } from "../interfaces";
import { getLogger } from '../libs/logger';
import { HttpStatusCode } from 'axios';

class JobController {

    constructor() {
    }

    async findProjectJobs(request: Request, response: Response): Promise<void> {
        let logger = getLogger('find-project-jobs');
        try {
            logger.info(`headers: ${JSON.stringify(request.auth)}`);


        } catch (err:any) {
            logger.error(`failed to create project: ${err}`)
            response.status(500).json({message: err.message});            
        }

    }

    async findProjectJob(request: Request, response: Response): Promise<void> {
        
    }

    async updateProjectJob(request: Request, response: Response): Promise<void> {
        
    }

    async deleteProjectJob(request: Request, response: Response): Promise<void> {
        
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

export default new JobController();