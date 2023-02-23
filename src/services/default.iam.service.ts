import { IAMRepository } from "../interfaces";
import { User } from "../model/model";
import { RoleType, UserStatusType } from "../model/zbi.enum";
import { IAMService } from "../interfaces";

export default class DefaultIAMService implements IAMService {

    private iamRepository: IAMRepository;

    constructor(iamRepository: IAMRepository) {
        this.iamRepository = iamRepository;
    }


    async createUser(user: User): Promise<User> {
        try {
            // invite user in auth0
            return user;            
        } catch(err) {
            throw err;
        }
    }


    async inviteOwner(userName: string, email: string, name: string): Promise<User> {
        try {
            let u:User = {userName, email, name, role: RoleType.owner, status: UserStatusType.invited};
            return this.iamRepository.createUser(u);
        } catch (err) {
            throw err;
        }
    }

    async findUsers(limit: number, page: number): Promise<User[]> {
        try {
            return await this.iamRepository.findUsers({}, limit, page);            
        } catch (err) {
            throw err;            
        }
    }

    async findByUserID(userId: string): Promise<User> {
        try {
            throw new Error("user error");
        } catch (err) {
            throw err;
        }
    }

    async findByUserName(userName: string) {
        try {
            return await this.iamRepository.findUser({userName});
        } catch (err) {
            throw err;
        }
    }

    async findByEmail(email: string) {
        try {
            return await this.iamRepository.findUser({email});
        } catch (err) {
            throw err;
        }

    }

    async completeRegistration() {

    }
    
    async resetPassword() {

    }

    async createTeam(owner: User, teamName: string) {

    }

    async findTeams(limit: number, page: number) {

    }

    async findTeam(teamId: string) {

    }

    async inviteTeamUser(email: string, teamId: string) {

    }

    async removeTeamUser(email: string, teamId: string) {

    }

    async findUserMemberships(userId: string) {

    }

    async findTeamInvitations() {

    }

}