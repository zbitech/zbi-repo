import {Request, Response} from 'express';
import { User } from 'src/model/model';
import beanFactory from '../factory/bean.factory';
import { UserService } from '../interfaces';

import { getLogger } from "../libs/logger";

class UserController {

    async findUsers(request: Request, response: Response): Promise<void> {

        let userService = beanFactory.getService("user");

        let logger = getLogger('uc');
        try {
            const users = await userService.findUsers(10, 1);
            response.json(users);
        } catch(err:any) {
            logger.error(`failed to find users: ${err}`)
            response.status(500).json({message: err.message});
        } finally {

        }

    }

    async createUser(request: Request, response: Response): Promise<void> {
        let userService:UserService = beanFactory.getService("user");

        let logger = getLogger('uc');
        try {

            logger.info(`creating user ... ${JSON.stringify(request.body)}`);
            const userRequest: User = request.body.user;
            //userService.findByUserID            
//            const user: User = iamService.

            response.end();
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

export default new UserController();