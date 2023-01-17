import { Team, User } from "../../model/model";
import { IAMRepository } from "../repository.interface";
import { UserSchema, TeamSchema } from "./schema.mongo";

export default class IAMMongoRepository implements IAMRepository {

    async createUser(user: User): Promise<User | undefined> {
        try {
            const uc = new UserSchema({...user});
            await uc.save();
            return createUser(uc);
        } catch(err) {
            throw err;
        }
    }

    async updateUser(user: User): Promise<User | undefined> {
        throw new Error("Method not implemented.");
    }

    async findUsers(params: {}, limit: number, skip: number): Promise<User[] | undefined> {
        throw new Error("Method not implemented.");
    }

    async findUser(params: {}): Promise<User | undefined> {
        throw new Error("Method not implemented.");
    }

    async resetUserPassword(userName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async activateUser(userName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async deactivateUser(userName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async validateAuth(type: string, value: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async findUserTeamMemberships(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async findTeams(): Promise<Team[] | undefined> {
        throw new Error("Method not implemented.");
    }

    async findTeam(teamId: string): Promise<Team | undefined> {
        throw new Error("Method not implemented.");
    }

    async findTeamMemberships(params: {}): Promise<Team[] | undefined> {
        throw new Error("Method not implemented.");
    }

    async removeTeamMembership(teamId: string): Promise<Team | undefined> {
        throw new Error("Method not implemented.");
    }
}

function createUser(uc: any): User {
    if(uc) {
        return {
            userName: uc.userName, name: uc.name, email: uc.email, role: uc.role
        }
    }

    return uc;
}