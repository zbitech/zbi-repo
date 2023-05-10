import {Request, Response} from 'express';
import { AuthRequest, QueryParam, Team, User } from 'src/model/model';
import { RoleType, UserStatusType } from 'src/model/zbi.enum';
import beanFactory from '../factory/bean.factory';
import { UserService } from '../interfaces';
import { signJwt } from "../libs/auth.libs";
import config from "config";

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

            const user = userService.createUser(request.body.email, request.body.name, RoleType.owner, UserStatusType.invited);
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


    async authenticateUser(request: Request, response: Response): Promise<void> {
        let userService: UserService = beanFactory.getUserService();
        let logger = getLogger('register-user');

        try {
            logger.info(`finding user ... ${JSON.stringify(request.body)}`);
            const result = await userService.authenticateUser(request.body);
            
            if(result.valid) {
                if(result.registered) {
                    // add tokens to cookie
                    response.send({accessToken: result.accessToken, refreshToken: result.refreshToken});

                    // need to handle redirect if necessary

                } else {
                    // needs registration
                }

            } else {
                // send unauthorized
            }

        } catch(err:any) {

        } finally {

        }
    }

    async changePassword(request: Request, response: Response): Promise<void> {
        let userService: UserService = beanFactory.getUserService();
        let logger = getLogger('change-password');

        try {
            logger.info(`finding user ... ${JSON.stringify(request.body)}`);
            const user = await userService.changePassword(request.body.email, request.body.old_password, request.body.new_password);
            
            if(user) {

            } else {

            }

        } catch(err:any) {

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

    async addTeamMember(request: Request, response: Response): Promise<void> {
        let userService: UserService = beanFactory.getUserService();
        let logger = getLogger('add-team-member');

        try {
            logger.info(`add team member ... ${JSON.stringify(request.body)}`);
            const team: Team = await userService.findTeam(request.body.teamid);

            // check if user exists or create

            userService.addTeamMember(team.id, "");
        } catch(err:any) {
            throw err;
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