import { signJwt } from "../libs/auth.libs";
import { UserRepository, IdentityService, UserService } from "../interfaces";
import { Team, TeamMembership, User, QueryParam, AuthRequest, AuthResult, RegisterRequest } from "../model/model";
import { FilterConditionType, RoleType, UserFilterType, UserStatusType, InviteStatusType, LoginProvider } from "../model/zbi.enum";
import config from "config";
import { getLogger } from "../libs/logger";
import { ApplicationError, BadRequestError, UserNotPermittedError } from "../libs/errors";
import beanFactory from "../factory/bean.factory";

class DefaultUserService implements UserService {

    constructor() {
    }

    async createUser(email: string, role: RoleType, status: UserStatusType): Promise<User> {
        const logger = getLogger("usvc-create-user");
        try {

            const userRepository = beanFactory.getUserRepository();
            const user = await userRepository.createUser(email, role, status);

            // TODO - send email to user

            return user;
        } catch (err:any) {
            logger.error(`error creating user - ${err}}`);

//            {"index":0,"code":11000,"keyPattern":{"email":1},"keyValue":{"email":"alphegasolutions@gmail.com"}}
 
            throw err;
        }
    }

    async updateUser(email: string, name: string, status: UserStatusType): Promise<User> {
        const logger = getLogger("usvc-update-user");
        const userRepository = beanFactory.getUserRepository();
        try {            
            return await userRepository.updateUser(email, name, status);
        } catch (err: any) {
            throw err;
        }
    }

    async authenticateUser(user: AuthRequest, provider: LoginProvider): Promise<AuthResult> {
        const logger = getLogger("usvc-authenticate-user");
        try {
            const userRepository = beanFactory.getUserRepository();
            const identityService = beanFactory.getIdentityService(provider);

            const result = await identityService.authenticateUser(user);
            logger.debug(`auth result => ${JSON.stringify(result)}`);

            if(result.valid) {

                // find user's registration
                const registration = await userRepository.findRegistration(result.email as string);
                logger.debug(`registration: ${JSON.stringify(registration)}`);
                if( registration && registration.acceptedTerms ) {
                    const accessToken = signJwt( {...result.user}, "accessTokenPrivateKey", { expiresIn: config.get("accesstokenTtl")});
                    const refreshToken = signJwt( {...result.user}, "refreshTokenPrivateKey", { expiresIn: config.get("refreshtokenTtl")});
                    return {valid: true, registered: true, accessToken, refreshToken};
                } else {
                    return {valid: true, registered: false};
                }
            }

            return result;

        } catch (err: any) {
            throw err;            
        }
    }

    async changePassword(email: string, old_password: string, new_password: string): Promise<User> {

        const logger = getLogger("usvc-change-password");
        try {
            const userRepository = beanFactory.getUserRepository();
            const user = await userRepository.validatePassword(email, old_password);
            if(user) {
                await userRepository.setPassword(email, new_password);
                return user as User;
            }

            throw new UserNotPermittedError("user not permitted");
        } catch (err: any) {
            throw err;            
        }

    }

    async registerUser(provider: LoginProvider, email: string, name: string, password: string): Promise<User> {

        const logger = getLogger("usvc-register-user");
        try {

            logger.info(`registering new user ${email} with ${provider} login provider`);
            const userRepository = beanFactory.getUserRepository();
            const user: User = await userRepository.getUserByEmail(email);
    
            if(user) {

                logger.debug(`found user for registration - ${JSON.stringify(user)}`);

                if(provider === LoginProvider.local) {
                    // validate and save password
                    await userRepository.setPassword(email, password);
                }

                await userRepository.createRegistration(email, name, provider);

                if(user.role === RoleType.owner) {
                    await this.createTeam(user.userid as string, "My Team");
                }

                return await userRepository.getUserByEmail(email);
            }

            throw new UserNotPermittedError("user not permitted");
        } catch (err: any) {
            logger.error(`failed to register new user - ${JSON.stringify(err)}`);
            throw err;
        }
    }

    async findUsers(params: QueryParam): Promise<User[]> {
        const logger = getLogger("usvc-find-users");
        try {
            const userRepository = beanFactory.getUserRepository();
            return await userRepository.findUsers(params);
        } catch (err) {
            throw err;
        }
    }

    async findUser(param: QueryParam): Promise<User> {
        const logger = getLogger("usvc-find-user");
        try {
            const userRepository = beanFactory.getUserRepository();
            return await userRepository.findUser(param);
        } catch (err) {
            throw err;
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        const logger = getLogger("usvc-get-user-email");
        try {
            const userRepository = beanFactory.getUserRepository();
            return await userRepository.getUserByEmail(email);
        } catch (err) {
            throw err;
        }        
    }

    async getUserById(userid: string): Promise<User> {
        const logger = getLogger("usvc-get-user-id");
        try {
            const userRepository = beanFactory.getUserRepository();
            return await userRepository.getUserById(userid);
        } catch (err) {
            throw err;
        }        
    }

    async deactivateUser(userid: string): Promise<User> {
        const logger = getLogger("usvc-deactivate-user");
        try {
            const userRepository = beanFactory.getUserRepository();
            const user: User = await userRepository.getUserById(userid);
            if(user.status != UserStatusType.active) {
                throw new BadRequestError("user must be active to be deactivated");
            }

            return await userRepository.deactivateUser(userid);

        } catch (err) {
            throw err;
        }
    }

    async reactivateUser(userid: string): Promise<User> {
        const logger = getLogger("usvc-reactivate-user");
        try {
            const userRepository = beanFactory.getUserRepository();
            const user: User = await userRepository.getUserById(userid);
            if(user.status != UserStatusType.inactive) {
                throw new BadRequestError("user must be inactive to be re-activated");
            }

            await userRepository.activateUser(userid);            
            return user;
        } catch (err) {
            throw err;
        }

    }

    async deleteUser(userid: string): Promise<void> {
        const logger = getLogger("usvc-delete-user");
        try {
            const userRepository = beanFactory.getUserRepository();
            const user: User = await userRepository.getUserById(userid);
            if(user.status != UserStatusType.inactive) {
                throw new BadRequestError("user must be inactive to be deleted");
            }
            
            const newUser = await userRepository.deleteUser(userid);

        } catch (err) {
            throw err;
        }

    }

    async createTeam(ownerid: string, name: string): Promise<Team> {
        const logger = getLogger("usvc-create-team");
        try {
            const userRepository = beanFactory.getUserRepository();
            return await userRepository.createTeam(ownerid, name);
        } catch (err) {
            throw err;
        }
    }

    async deleteTeam(teamid: string): Promise<void> {
        const logger = getLogger("usvc-delete-team");
        try {
            const userRepository = beanFactory.getUserRepository();
            // TODO - check team status
            await userRepository.deleteTeam(teamid);
        } catch (err) {
            throw err;
        }
    }

    async updateTeam(teamid: string, name: string): Promise<Team> {
        const logger = getLogger("usvc-update-team");
        try {            
            const userRepository = beanFactory.getUserRepository();
            return await userRepository.updateTeam(teamid, name);
        } catch (err) {
            throw err;
        }

    }

    async findTeams(params: {}): Promise<Team[]> {
        const logger = getLogger("usvc-find-teams");
        try {            
            const userRepository = beanFactory.getUserRepository();
            return await userRepository.findTeams();
        } catch (err) {
            throw err;
        }

    }

    async findTeam(teamid: string): Promise<Team> {
        const logger = getLogger("usvc-find-team");
        try {
            const userRepository = beanFactory.getUserRepository();
            return await userRepository.findTeam(teamid);            
        } catch (err) {
            throw err;
        }
    }

    async findTeamMemberships(userid: string): Promise<TeamMembership[]> {
        try {            
            const userRepository = beanFactory.getUserRepository();
            const memberships = await userRepository.findTeamMemberships(userid);
            return []
        } catch (err) {
            throw err;
        }

    }

    async addTeamMember(teamid: string, email: string): Promise<Team> {
        const logger = getLogger("usvc-add-member");
        try {            
            const userRepository = beanFactory.getUserRepository();
            let user = await userRepository.getUserByEmail(email);

            if(!user) {
                user = await this.createUser(email, RoleType.user, UserStatusType.invited);
            }

            // TODO - check for pre-existing membership

            return await userRepository.addTeamMembership(teamid, user.userid as string); 
        } catch (err) {
            throw err;
        }

    }

    async removeTeamMember(teamid: string, email: string): Promise<Team> {
        try {            
            const userRepository = beanFactory.getUserRepository();
            const user = await userRepository.getUserByEmail(email);

            if(!user) {
                // TODO return error
            }

            return await userRepository.removeTeamMembership(teamid, user.userid as string);
        } catch (err) {
            throw err;
        }
    }

    async updateTeamMembership(email: string, teamid: string, status: InviteStatusType): Promise<void> {
        try {            
            const userRepository = beanFactory.getUserRepository();
            const user = await userRepository.getUserByEmail(email);
            await userRepository.updateTeamMembership(teamid, user.userid as string, status);
        } catch (err) {
            throw err;
        }
    }

}

export default new DefaultUserService();