import {Request, Response} from 'express';
import { User } from 'src/model/model';
import beanFactory from '../bean.factory';
import { IAMService } from '../interfaces';

import { getLogger } from "../logger";

export default class UserController {

    async findUsers(request: Request, response: Response): Promise<void> {

        let iamService = beanFactory.getService("iam");

        let logger = getLogger('uc');
        try {
            const users = await iamService.findUsers(10, 1);
            response.json(users);
        } catch(err:any) {
            logger.error(`failed to find users: ${err}`)
            response.status(500).json({message: err.message});
        } finally {

        }

    }

    async createUser(request: Request, response: Response): Promise<void> {
        let iamService = beanFactory.getService("iam");

        let logger = getLogger('uc');
        try {

            logger.info(`creating user ... ${request.body}`);
//            const user: User = iamService.
        } catch(err:any) {
            logger.error(`failed to find users: ${err}`)
            response.status(500).json({message: err.message});
        } finally {

        }
    }

    async findUser(request: Request, response: Response): Promise<void> {

    }

    async deactivateUser(request: Request, response: Response): Promise<void> {

    }

    async reactivateUser(request: Request, response: Response): Promise<void> {

    }

    async deleteUser(request: Request, response: Response): Promise<void> {

    }

}