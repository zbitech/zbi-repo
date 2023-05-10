import { signJwt } from "../libs/auth.libs";
import { UserRepository, IdentityService, UserService } from "../interfaces";
import { Team, TeamMembership, User, QueryParam, AuthRequest, AuthResult } from "../model/model";
import { FilterConditionType, RoleType, UserFilterType, UserStatusType, InviteStatusType } from "../model/zbi.enum";
import config from "config";

export default class DefaultUserService implements UserService {

    private userRepository: UserRepository;
    private identityService: IdentityService;

    constructor(userRepository: UserRepository, identityService: IdentityService) {
        this.userRepository = userRepository;
        this.identityService = identityService;
    }

    async createUser(email: string, name: string, role: RoleType, status: UserStatusType): Promise<User> {
        try {            
            return await this.userRepository.createUser(email, name, role, status);
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
        try {
            const result = await this.identityService.authenticateUser(user);

            if(result.valid) {

                // find user's registration
                const registration = await this.userRepository.findRegistration(result.email as string);
                if( registration ) {
                    const accessToken = signJwt( {...result.user}, "accessTokenPrivateKey", { expiresIn: config.get("accessTokenTtl")});
                    const refreshToken = signJwt( {...result.user}, "refreshTokenPrivateKey", { expiresIn: config.get("refreshTokenTtl")});
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

            throw Error("invalid user");
        } catch (err: any) {
            throw err;            
        }

    }

    async registerUser(email: string, acceptedTerms: boolean): Promise<User> {
        try {
            
            const param: QueryParam = {name: UserFilterType.email, condition: FilterConditionType.equal, value: email};
            const user: User = await this.userRepository.findUser(param);
    
            if(user) {
                await this.userRepository.updateRegistration(email, acceptedTerms);
                return await this.userRepository.updateUser(email, user.name, UserStatusType.active);
            }

            throw Error("user not permitted");
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
            const param: QueryParam = {name: UserFilterType.email, condition: FilterConditionType.equal, value: email};
            const user: User = await this.userRepository.findUser(param);

            await this.userRepository.deactivateUser(email);

            return user;
        } catch (err) {
            throw err;
        }
    }

    async reactivateUser(email: string): Promise<User> {
        try {
            const param: QueryParam = {name: UserFilterType.userid, condition: FilterConditionType.equal, value: email};
            const user: User = await this.userRepository.findUser(param);
            await this.userRepository.activateUser(email);            
            return user;
        } catch (err) {
            throw err;
        }

    }

    async deleteUser(email: string): Promise<void> {
        try {
            
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
                user = await this.createUser(email, "", RoleType.owner, UserStatusType.invited);
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