import { UserRepository, IdentityService, UserService } from "../interfaces";
import { Team, TeamMembership, User, QueryParam } from "../model/model";
import { FilterConditionType, RoleType, UserFilterType, UserStatusType, InviteStatusType } from "../model/zbi.enum";

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
            return await this.identityService.updateUser(user);
        } catch (err) {
            throw err;
        }
    }

    async registerUser(userid: string): Promise<User> {
        try {
            const param: QueryParam = {name: UserFilterType.userid, condition: FilterConditionType.equal, value: userid};
            
            const user: User = await this.userRepository.findUser(param)
            user.status = UserStatusType.active;

            // accept team membership
            if(user.role === RoleType.user) {

            }

            return await this.userRepository.updateUser(user);
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

    async deactivateUser(userid: string): Promise<User> {
        try {
            const param: QueryParam = {name: UserFilterType.userid, condition: FilterConditionType.equal, value: userid};
            const user: User = await this.userRepository.findUser(param);

            await this.identityService.deactivateUser(userid);

            return user;
        } catch (err) {
            throw err;
        }
    }

    async reactivateUser(userid: string): Promise<User> {
        try {
            const param: QueryParam = {name: UserFilterType.userid, condition: FilterConditionType.equal, value: userid};
            const user: User = await this.userRepository.findUser(param);
                        
            await this.identityService.activateUser(userid);            
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

    async updateTeamMembership(userid: string, status: InviteStatusType): Promise<void> {

    }

}