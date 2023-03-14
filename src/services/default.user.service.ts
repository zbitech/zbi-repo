import { UserRepository, IdentityService, UserService } from "../interfaces";
import { Team, TeamMembership, User } from "../model/model";
import { RoleType, UserStatusType } from "../model/zbi.enum";

export default class DefaultUserService implements UserService {

    private userRepository: UserRepository;
    private identityService: IdentityService;

    constructor(userRepository: UserRepository, identityService: IdentityService) {
        this.userRepository = userRepository;
        this.identityService = identityService;
    }

    async createUser(user: User): Promise<User> {
        try {            
            return await this.identityService.createUser(user);
        } catch (err) {
            throw err;
        }
    }

    async updateUser(user: User): Promise<User> {
        try {            
            return this.identityService.updateUser(user);
        } catch (err) {
            throw err;
        }
    }

    async findUsers(params: {}, size: number, page: number): Promise<User[]> {
        try {
            return await this.userRepository.findUsers(params, size, page);
        } catch (err) {
            throw err;
        }
    }

    async findUser(param: {}): Promise<User> {
        try {   
            return await this.userRepository.findUser(param);
        } catch (err) {
            throw err;
        }
    }

    async deactivateUser(userid: string): Promise<User> {
        try {
            
            const user: User = await this.userRepository.findUser({userid});

            await this.identityService.deactivateUser(userid);

            user.status = UserStatusType.inactive;
            await this.userRepository.updateUser(user);
            return user;
        } catch (err) {
            throw err;
        }
    }

    async reactivateUser(userid: string): Promise<User> {
        try {
            const user: User = await this.userRepository.findUser({userid});
            
            await this.identityService.reactivateUser(userid);
            user.status = UserStatusType.active;
            await this.userRepository.updateUser(user);
            
            return user;
        } catch (err) {
            throw err;
        }

    }

    async deleteUser(userid: string): Promise<void> {
        try {
            
            const newUser = await this.identityService.deleteUser(userid);

        } catch (err) {
            throw err;
        }

    }

    async createTeam(owner: string, name: string): Promise<Team> {
        try {            
            return await this.userRepository.createTeam(owner, name);
        } catch (err) {
            throw err;
        }
    }

    async updateTeam(teamid: string, name: string): Promise<Team> {
        try {            
            // const team: Team = this.iamRepository.findTeam(teamid);
            // team.name = name;
            // return await this.iamRepository.up
            const team: Team = await this.userRepository.findTeam(teamid);
            return team;
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

    async addTeamMember(teamid: string, userid: string): Promise<Team> {
        try {            
            return await this.userRepository.addTeamMembership(teamid, userid);
        } catch (err) {
            throw err;
        }

    }

    async removeTeamMember(teamid: string, userid: string): Promise<Team> {
        try {            
            return await this.userRepository.removeTeamMembership(teamid, userid);
        } catch (err) {
            throw err;
        }

    }




    // async createUser(user: User): Promise<User> {
    //     try {
    //         // invite user in auth0
    //         return user;            
    //     } catch(err) {
    //         throw err;
    //     }
    // }


    // async inviteOwner(userName: string, email: string, name: string): Promise<User> {
    //     try {
    //         let u:User = {userName, email, name, role: RoleType.owner, status: UserStatusType.invited};
    //         return this.iamRepository.createUser(u);
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    // async findUsers(limit: number, page: number): Promise<User[]> {
    //     try {
    //         return await this.iamRepository.findUsers({}, limit, page);            
    //     } catch (err) {
    //         throw err;            
    //     }
    // }

    // async findByUserID(userId: string): Promise<User> {
    //     try {
    //         throw new Error("user error");
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    // async findByUserName(userName: string) {
    //     try {
    //         return await this.iamRepository.findUser({userName});
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    // async findByEmail(email: string) {
    //     try {
    //         return await this.iamRepository.findUser({email});
    //     } catch (err) {
    //         throw err;
    //     }

    // }

    // async completeRegistration() {
    // }
    
    // async resetPassword() {
    // }

    // async createTeam(owner: User, teamName: string) {
    // }

    // async findTeams(limit: number, page: number) {
    // }

    // async findTeam(teamId: string) {
    // }

    // async inviteTeamUser(email: string, teamId: string) {
    // }

    // async removeTeamUser(email: string, teamId: string) {
    // }

    // async findUserMemberships(userId: string) {
    // }

    // async findTeamInvitations() {
    // }

}