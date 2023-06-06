import {Request, Response} from 'express';
import { AuthRequest, QueryParam, Team, User } from '../model/model';
import { FilterConditionType, LoginProvider, RoleType, TeamFilterType, UserFilterType, UserStatusType } from '../model/zbi.enum';
import beanFactory from '../factory/bean.factory';
import { UserService } from '../interfaces';
import { signJwt } from "../libs/auth.libs";
import config from "config";

import { getLogger } from "../libs/logger";
import { HttpStatusCode } from 'axios';

class UserController {

    async findUsers(request: Request, response: Response): Promise<void> {

        let logger = getLogger('uc');
        try {
            let userService:UserService = beanFactory.getUserService();

            const name = request.query.name as UserFilterType;
            const value = request.query.value as string;
            const size = request.query.size;
            const page = request.query.page;
            const param = name ? {name, condition: FilterConditionType.equal, value: value} : {};

            const users = await userService.findUsers(param, size, page);
            response.json({users, size, page});
        } catch(err:any) {
            logger.error(`failed to find users: ${err}`)
            response.status(500).json({message: err.message});
        } finally {

        }

    }

    async inviteResourceOwner(request: Request, response: Response): Promise<void> {

        let logger = getLogger('invite-owner');
        try {
            let userService:UserService = beanFactory.getUserService();

            logger.info(`creating resource owner ... ${JSON.stringify(request.body)}`);
            const email = request.body.email;

            const user = await userService.createUser(email, RoleType.owner, UserStatusType.invited);
            response.status(HttpStatusCode.Ok).json({user});
        } catch(err:any) {
            logger.error(`failed to invite resource uowner: ${err}`)
            response.status(err.code).json({message: err.message});
        } finally {

        }
    }

    async getAccount(request: Request, response: Response): Promise<void> {

        let logger = getLogger('get-account');

        try {
     
            let userService:UserService = beanFactory.getUserService();
            const user = await userService.getUserByEmail(response.locals.subject.email);
            response.status(HttpStatusCode.Ok).json({user});            
        } catch(err:any) {

        } finally {

        }
    }

    async updateAccount(request: Request, response: Response): Promise<void> {

        let logger = getLogger('update-account');

        try {
            let userService:UserService = beanFactory.getUserService();
            const email = response.locals.subject.email;
            
        } catch(err:any) {

        } finally {

        }
    }

    async deleteAccount(request: Request, response: Response): Promise<void> {

        let logger = getLogger('delete-account');

        try {
            let userService:UserService = beanFactory.getUserService();
            const userid = response.locals.subject.userid;

            await userService.deleteUser(userid);
            response.sendStatus(HttpStatusCode.NoContent);
        } catch(err: any) {

        } finally {

        }
    }

    async findUser(request: Request, response: Response): Promise<void> {

        let logger = getLogger('find-user');
        try {
            let userService:UserService = beanFactory.getUserService();

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
        let logger = getLogger('register-user');

        try {
            let userService:UserService = beanFactory.getUserService();

            logger.info(`finding user ... ${JSON.stringify(request.body)}`);
            const provider = request.params["provider"] as LoginProvider;
            const result = await userService.authenticateUser(request.body, provider);

            //console.log(`Body: ${JSON.stringify(request.body)}, Provider: ${provider}`);
            //console.log(`Params: ${JSON.stringify(request.params)}`);
            //console.log(`Auth result: ${JSON.stringify(result)}`);
            if(result.valid) {
                if(result.registered) {
                    // add tokens to cookie
                    response.status(HttpStatusCode.Ok).send({accessToken: result.accessToken, refreshToken: result.refreshToken});

                    // need to handle redirect if necessary

                } else {
                    // needs registration
                    response.status(HttpStatusCode.Forbidden).send({registered: false, message: "Registration required"});
                }

            } else {
                // send unauthorized
                response.sendStatus(HttpStatusCode.Unauthorized);
            }

        } catch(err:any) {
            response.status(HttpStatusCode.InternalServerError).json({message: err.message});
        } finally {

        }
    }

    async changePassword(request: Request, response: Response): Promise<void> {
        let logger = getLogger('change-password');

        try {
            let userService:UserService = beanFactory.getUserService();

            logger.info(`finding user ... ${JSON.stringify(request.body)}`);
            const user = await userService.changePassword(request.body.email, request.body.old_password, request.body.new_password);
            
            if(user) {

            } else {

            }

        } catch(err:any) {

        } finally {

        }
    }

    async registerLocalUser(request: Request, response: Response): Promise<void> {
        let logger = getLogger('register-user');

        try {

            const provider = LoginProvider.local;
            const register = request.body;
            const {name, email, password, acceptedTerms} = request.body;

            let userService: UserService = beanFactory.getUserService();

            logger.info(`registering new local user ... ${JSON.stringify(request.body)}`);
            const user = await userService.registerUser(provider, email, name, password);

            response.status(HttpStatusCode.Ok).json(user);
        } catch(err:any) {
            response.status(err.code).json({message: err.message});
        } finally {

        }
    }

    async registerExternalUser(request: Request, response: Response): Promise<void> {
        let logger = getLogger('register-user');

        try {

            const provider = request.params.provider as LoginProvider;
            const {name, acceptedTerms} = request.body;
            const email = response.locals.subject.email;

            let userService: UserService = beanFactory.getUserService();

            logger.info(`finding user ... ${JSON.stringify(request.body)}`);
            const user = await userService.registerUser(provider, email, name, "");
            response.status(HttpStatusCode.Ok).json(user);

        } catch(err:any) {
            response.status(err.code).json({message: err.message});
        } finally {

        }
    }

    async deactivateUser(request: Request, response: Response): Promise<void> {
        let logger = getLogger(`deactivate-user`);

        try {
            let userService: UserService = beanFactory.getUserService();
            const userid = request.params.userid;

            const user = await userService.deactivateUser(userid);
            response.status(HttpStatusCode.Ok).json(user);
            
        } catch (err: any) {
            response.status(err.code).json({message: err.message}); 
        }

    }

    async reactivateUser(request: Request, response: Response): Promise<void> {
        let logger = getLogger(`reactivate-user`);

        try {
            let userService: UserService = beanFactory.getUserService();
            const userid = request.params.userid;

            const user = await userService.reactivateUser(userid);
            response.status(HttpStatusCode.Ok).json(user);
            
        } catch (err: any) {
            response.status(err.code).json({message: err.message}); 
        }

    }

    async deleteUser(request: Request, response: Response): Promise<void> {
        let logger = getLogger(`delete-user`);

        try {
            let userService: UserService = beanFactory.getUserService();
            const userid = request.params.userid;

            await userService.deleteUser(userid);
            response.sendStatus(HttpStatusCode.Ok)
            
        } catch (err: any) {
            response.status(err.code).json({message: err.message}); 
        }
    }

    async updateUser(request: Request, response: Response): Promise<void> {
        let logger = getLogger(`update-user`);

        try {
            let userService: UserService = beanFactory.getUserService();
            const {email, name} = request.body;

//            const user = userService.updateUser(email as string, name as string);
//            response.status(HttpStatusCode.Ok).json(user);
            
        } catch (err: any) {
            response.status(err.code).json({message: err.message}); 
        }
    }

    async findTeams(request: Request, response: Response): Promise<void> {
        let logger = getLogger('find-teams');

        try {
            let userService: UserService = beanFactory.getUserService();
            logger.info(`find teams ... ${JSON.stringify(request.body)}`);

            const param: QueryParam = request.body.param;
            const size = parseInt(request.query.size as string);
            const page = parseInt(request.query.page as string);

            const teams = await userService.findTeams(param, size, page);
            response.status(HttpStatusCode.Ok).json({teams, size, page});
        } catch(err:any) {
            response.status(err.code).json({message: err.message});
        } finally {

        }
    }

    async findTeam(request: Request, response: Response): Promise<void> {
        let logger = getLogger('find-team');

        try {
            let userService: UserService = beanFactory.getUserService();
            const teamid = request.params.teamid; 
            const team = await userService.findTeam(teamid);

            response.status(HttpStatusCode.Ok).json({team});
        } catch(err:any) {  
            response.status(err.code).json({message: err.message});
        } finally {

        }
    }

    async getMyTeam(request: Request, response: Response): Promise<void> {
        let logger = getLogger('get-my-team');

        try {
            let userService: UserService = beanFactory.getUserService();
            const userid = response.locals.subject.userid;
            const params = {name: TeamFilterType.owner, condition: FilterConditionType.equal, value: userid};

            const teams = await userService.findTeams(params, 10, 1);

            response.status(HttpStatusCode.Ok).json({teams});
        } catch(err:any) {  
            response.status(err.code).json({message: err.message});
        } finally {

        }
    }

    async deleteTeam(request: Request, response: Response): Promise<void> {
        let logger = getLogger('delete-team');

        try {
            let userService: UserService = beanFactory.getUserService();
            const teamid = request.params.teamid; 
            await userService.deleteTeam(teamid);
            response.status(HttpStatusCode.Ok);
        } catch(err:any) {
            response.status(err.code).json({message: err.message});
        } finally {

        }
    }

    async addTeamMember(request: Request, response: Response): Promise<void> {

        let logger = getLogger('add-team-member');

        try {

            let userService: UserService = beanFactory.getUserService();

            const teamid = request.params.teamid; 
            const email = request.body.email;

            let team: Team = await userService.findTeam(teamid);

            logger.info(`adding user ${email} to team ${teamid} - [${team.name}]`);
            
            team = await userService.addTeamMember(team.id, email);
            response.status(HttpStatusCode.Ok).json({team});
        } catch(err:any) {
            response.status(err.code).json({message: err.message});
        } finally {

        }
    }

    async removeTeamMember(request: Request, response: Response): Promise<void> {
        let logger = getLogger('remove-team-member');

        try {
            let userService: UserService = beanFactory.getUserService();

            const teamid = request.params.teamid;
            const email = request.body.email;

            const team = await userService.removeTeamMember(teamid, email);
            response.status(HttpStatusCode.Ok).json({team});
        } catch(err:any) {
            response.status(err.code).json({message: err.message});
        } finally {

        }
    }

    async getMemberships(request: Request, response: Response): Promise<void> {
        let logger = getLogger('get-memberships');

        try {
            let userService: UserService = beanFactory.getUserService();
            const userid = response.locals.subject.userid;

            logger.info(`geting memberships for ... ${userid}`);

            const memberships = await userService.findTeamMemberships(userid);
            response.status(HttpStatusCode.Ok).json({memberships});
        } catch(err:any) {
            response.status(err.code).json({message: err.message});
        } finally {

        }
    }

    async acceptMembership(request: Request, response: Response): Promise<void> {
        let logger = getLogger('update-membership');

        try {
            let userService: UserService = beanFactory.getUserService();

        } catch(err:any) {

        } finally {

        }
    }

    async deleteMembership(request: Request, response: Response): Promise<void> {
        let logger = getLogger('update-membership');

        try {
            let userService: UserService = beanFactory.getUserService();
            logger.info(`deleting membership ... ${JSON.stringify(request.body)}`);

        } catch(err:any) {

        } finally {

        }
    }


}

export default new UserController();