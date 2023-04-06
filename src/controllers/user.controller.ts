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

    async getAccount(request: Request, response: Response): Promise<void> {
        let userService:UserService = beanFactory.getUserService();
        let logger = getLogger('get-account');

        try {
            logger.info(`finding user ... ${JSON.stringify(request.body)}`);

        } catch(err:any) {

        } finally {

        }
    }

    async updateAccount(request: Request, response: Response): Promise<void> {
        let userService:UserService = beanFactory.getUserService();
        let logger = getLogger('update-account');

        try {
            logger.info(`updating account ... ${JSON.stringify(request.body)}`);

        } catch(err:any) {

        } finally {

        }
    }

    async deleteAccount(request: Request, response: Response): Promise<void> {
        let userService: UserService = beanFactory.getUserService();
        let logger = getLogger('delete-account');

        try {
            logger.info('deleting account ..');
        } catch(err: any) {

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
        let userService: UserService = beanFactory.getUserService();
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

    async updateUser(request: Request, response: Response): Promise<void> {

    }

    async findTeams(request: Request, response: Response): Promise<void> {
        let userService: UserService = beanFactory.getUserService();
        let logger = getLogger('find-teams');

        try {
            logger.info(`find teams ... ${JSON.stringify(request.body)}`);

        } catch(err:any) {

        } finally {

        }
    }

    async findTeam(request: Request, response: Response): Promise<void> {
        let userService: UserService = beanFactory.getUserService();
        let logger = getLogger('find-team');

        try {
            logger.info(`find team ... ${JSON.stringify(request.body)}`);

        } catch(err:any) {

        } finally {

        }
    }

    async deleteTeam(request: Request, response: Response): Promise<void> {
        let userService: UserService = beanFactory.getUserService();
        let logger = getLogger('delete-team');

        try {
            logger.info(`delete team ... ${JSON.stringify(request.body)}`);

        } catch(err:any) {

        } finally {

        }
    }

    async updateTeamMember(request: Request, response: Response): Promise<void> {
        let userService: UserService = beanFactory.getUserService();
        let logger = getLogger('add-team-member');

        try {
            logger.info(`find team ... ${JSON.stringify(request.body)}`);

        } catch(err:any) {

        } finally {

        }
    }

    async removeTeamMember(request: Request, response: Response): Promise<void> {
        let userService: UserService = beanFactory.getUserService();
        let logger = getLogger('remove-team-member');

        try {
            logger.info(`find team ... ${JSON.stringify(request.body)}`);

        } catch(err:any) {

        } finally {

        }
    }

    async getMemberships(request: Request, response: Response): Promise<void> {
        let userService: UserService = beanFactory.getUserService();
        let logger = getLogger('get-memberships');

        try {
            logger.info(`updating membership ... ${JSON.stringify(request.body)}`);

        } catch(err:any) {

        } finally {

        }
    }

    async acceptMembership(request: Request, response: Response): Promise<void> {
        let userService: UserService = beanFactory.getUserService();
        let logger = getLogger('update-membership');

        try {
            logger.info(`updating membership ... ${JSON.stringify(request.body)}`);

        } catch(err:any) {

        } finally {

        }
    }

    async deleteMembership(request: Request, response: Response): Promise<void> {
        let userService: UserService = beanFactory.getUserService();
        let logger = getLogger('update-membership');

        try {
            logger.info(`deleting membership ... ${JSON.stringify(request.body)}`);

        } catch(err:any) {

        } finally {

        }
    }


}

export default new UserController();