import { signJwt } from "../libs/auth.libs";
import { UserRepository, IdentityService, UserService } from "../interfaces";
import { Team, TeamMembership, User, QueryParam, AuthRequest, AuthResult, RegisterRequest } from "../model/model";
import { FilterConditionType, RoleType, UserFilterType, UserStatusType, InviteStatusType, LoginProvider } from "../model/zbi.enum";
import config from "config";
import { getLogger } from "../libs/logger";
import { AppErrorType, ApplicationError } from "../libs/errors";

export default class DefaultUserService implements UserService {

    private userRepository: UserRepository;
    private identityService: IdentityService;

    constructor(userRepository: UserRepository, identityService: IdentityService) {
        this.userRepository = userRepository;
        this.identityService = identityService;
    }

    async createUser(email: string, role: RoleType, status: UserStatusType): Promise<User> {
        try {            
            return await this.userRepository.createUser(email, role, status);
        } catch (err) {
            throw err;
        }
    }

    async updateUser(email: string, name: string, status: UserStatusType): Promise<User> {
        try {            
            return await this.userRepository.updateUser(email, name, status);
        } catch (err: any) {
            throw err;
        }
    }

    async authenticateUser(user: AuthRequest): Promise<AuthResult> {
        const logger = getLogger("authenticate-user");
        try {
            const result = await this.identityService.authenticateUser(user);
            logger.debug(`auth result => ${JSON.stringify(result)}`);

            if(result.valid) {

                // find user's registration
                const registration = await this.userRepository.findRegistration(result.email as string);
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

        try {
            const user = await this.userRepository.validatePassword(email, old_password);
            if(user) {
                await this.userRepository.setPassword(email, new_password);
                return user as User;
            }

            throw new ApplicationError(AppErrorType.USER_NOT_PERMITTED, "user not permitted");
        } catch (err: any) {
            throw err;            
        }

    }

    async registerUser(request: RegisterRequest): Promise<User> {
        try {
            
            const user: User = await this.userRepository.getUserByEmail(request.email);
    
            if(user) {

                const name = request.name as string;

                if(request.provider === LoginProvider.local) {
                    // validate and save password
                    const password = request.password as string;
                    await this.userRepository.setPassword(request.email, password);
                }

                await this.userRepository.createRegistration(request.email, name, request.provider);
                return await this.userRepository.getUserByEmail(request.email);
            }

            throw new ApplicationError(AppErrorType.USER_NOT_PERMITTED, "user not permitted");
        } catch (err) {
            throw err;
        }
    }

    async findUsers(params: QueryParam, size: number, page: number): Promise<User[]> {
        try {
            return await this.userRepository.findUsers(params, size, page);
        } catch (err) {
            throw err;
        }
    }

    async findUser(param: QueryParam): Promise<User> {
        try {
            return await this.userRepository.findUser(param);
        } catch (err) {
            throw err;
        }
    }

    async deactivateUser(email: string): Promise<User> {
        try {
            const user: User = await this.userRepository.getUserByEmail(email);
            if(user.status != UserStatusType.active) {
                throw new ApplicationError(AppErrorType.USER_NOT_ACTIVE, "user must be active to be deactivated");
            }

            return await this.userRepository.deactivateUser(email);

        } catch (err) {
            throw err;
        }
    }

    async reactivateUser(email: string): Promise<User> {
        try {
            const user: User = await this.userRepository.getUserByEmail(email);
            if(user.status != UserStatusType.inactive) {
                throw new ApplicationError(AppErrorType.USER_NOT_INACTIVE, "user must be inactive to be re-activated");
            }

            await this.userRepository.activateUser(email);            
            return user;
        } catch (err) {
            throw err;
        }

    }

    async deleteUser(email: string): Promise<void> {
        try {
            const user: User = await this.userRepository.getUserByEmail(email);
            if(user.status != UserStatusType.inactive) {
                throw new ApplicationError(AppErrorType.USER_NOT_INACTIVE, "user must be inactive to be deleted");
            }
            
            const newUser = await this.userRepository.deleteUser(email);

        } catch (err) {
            throw err;
        }

    }

    async createTeam(owner: string, name: string): Promise<Team> {
        try {            
            const user = await this.userRepository.getUserByEmail(owner);            
            return await this.userRepository.createTeam(user.userid as string, name);
        } catch (err) {
            throw err;
        }
    }

    async updateTeam(teamid: string, name: string): Promise<Team> {
        try {            
            return await this.userRepository.updateTeam(teamid, name);
        } catch (err) {
            throw err;
        }

    }

    async findTeams(params: {}, size: number, page: number): Promise<Team[]> {
        try {            
            return await this.userRepository.findTeams(size, page);
        } catch (err) {
            throw err;
        }

    }

    async findTeam(teamid: string): Promise<Team> {
        try {
            return await this.userRepository.findTeam(teamid);            
        } catch (err) {
            throw err;
        }
    }

    async findTeamMemberships(userid: string): Promise<TeamMembership[]> {
        try {            
            await this.userRepository.findTeamMemberships(userid);
            return []
        } catch (err) {
            throw err;
        }

    }

    async addTeamMember(teamid: string, email: string): Promise<Team> {
        try {            
            let user = await this.userRepository.getUserByEmail(email);
            if(!user) {
                user = await this.createUser(email, RoleType.owner, UserStatusType.invited);
            }

            return await this.userRepository.addTeamMembership(teamid, user.userid as string);
        } catch (err) {
            throw err;
        }

    }

    async removeTeamMember(teamid: string, email: string): Promise<Team> {
        try {            
            const user = await this.userRepository.getUserByEmail(email);
            return await this.userRepository.removeTeamMembership(teamid, user.userid as string);
        } catch (err) {
            throw err;
        }
    }

    async updateTeamMembership(email: string, teamid: string, status: InviteStatusType): Promise<void> {
        try {            
            const user = await this.userRepository.getUserByEmail(email);
            await this.userRepository.updateTeamMembership(teamid, user.userid as string, status);
        } catch (err) {
            throw err;
        }
    }

}