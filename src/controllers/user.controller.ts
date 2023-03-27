import {Request, Response} from 'express';
import { QueryParam, User } from 'src/model/model';
import beanFactory from '../factory/bean.factory';
import { UserService } from '../interfaces';

import { getLogger } from "../libs/logger";

class UserController {

    async findUsers(request: Request, response: Response): Promise<void> {

        let userService:UserService = beanFactory.getUserService();

        let logger = getLogger('uc');
        try {

            const param: QueryParam = request.body.param;
            const size: number = request.body.size;
            const page: number = request.body.page;

            const users = await userService.findUsers(param, size, page);
            response.json(users);
        } catch(err:any) {
            logger.error(`failed to find users: ${err}`)
            response.status(500).json({message: err.message});
        } finally {

        }

    }

    async createUser(request: Request, response: Response): Promise<void> {
        let userService:UserService = beanFactory.getUserService();

        let logger = getLogger('create-user');
        try {

            logger.info(`creating user ... ${JSON.stringify(request.body)}`);
            const userRequest: User = request.body.user;

            const user = userService.createUser(userRequest);
            response.json(user);

        } catch(err:any) {
            logger.error(`failed to find users: ${err}`)
            response.status(500).json({message: err.message});
        } finally {

        }
    }

    async findUser(request: Request, response: Response): Promise<void> {
        let userService:UserService = beanFactory.getUserService();

        let logger = getLogger('find-user');
        try {

            logger.info(`finding user ... ${JSON.stringify(request.body)}`);
            const param: QueryParam = request.body.param;

            const user = userService.findUser(param);
            response.json(user);

        } catch(err:any) {
            logger.error(`failed to find users: ${err}`)
            response.status(500).json({message: err.message});
        } finally {

        }
    }

    async registerUser(request: Request, response: Response): Promise<void> {
        let userService:UserService = beanFactory.getUserService();
        let logger = getLogger('register-user');

        try {
            logger.info(`finding user ... ${JSON.stringify(request.body)}`);

        } catch(err:any) {

        } finally {

        }
    }

    async deactivateUser(request: Request, response: Response): Promise<void> {

    }

    async reactivateUser(request: Request, response: Response): Promise<void> {

    }

    async deleteUser(request: Request, response: Response): Promise<void> {

    }

}

export default new UserController();