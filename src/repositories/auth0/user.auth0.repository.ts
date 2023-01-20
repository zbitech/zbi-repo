import { IAMRepository } from "../../interfaces";
import { Team, User } from "../../model/model";

const AUTH0_TENANT_ID = process.env.AUTH0_TENANT_ID;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_GRANT_TYPE = process.env.AUTH0_GRANT_TYPE;

const AUTH0_URL=`https://${AUTH0_TENANT_ID}.${AUTH0_DOMAIN}`

export class UserAuth0Repository implements IAMRepository {
    createUser(user: User): Promise<User> {
        throw new Error("Method not implemented.");
    }
    updateUser(user: User): Promise<User> {
        throw new Error("Method not implemented.");
    }
    findUsers(params: {}, limit: number, skip: number): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
    findUser(params: {}): Promise<User> {
        throw new Error("Method not implemented.");
    }
    resetUserPassword(userName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    activateUser(userName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    deactivateUser(userName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    validateAuth(type: string, value: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    createTeam(ownerId: string, name: string): Promise<Team> {
        throw new Error("Method not implemented.");
    }
    findTeams(limit: number, skip: number): Promise<Team[]> {
        throw new Error("Method not implemented.");
    }
    findTeam(teamId: string): Promise<Team> {
        throw new Error("Method not implemented.");
    }
    findTeamMemberships(userId: string): Promise<Team[]> {
        throw new Error("Method not implemented.");
    }
    removeTeamMembership(teamId: string, userId: string): Promise<Team> {
        throw new Error("Method not implemented.");
    }
    addTeamMembership(teamId: string, userId: string): Promise<Team> {
        throw new Error("Method not implemented.");
    }
    findPendingMemberships(): Promise<Team[]> {
        throw new Error("Method not implemented.");
    }

    userRepo: IAMRepository | undefined;

    async create(data: User): Promise<User|undefined> {
        try {
            return undefined;
        } catch(err) {
            throw err;
        }
    }

    async update(data: User): Promise<User|undefined> {
        try {
            return undefined;
        } catch(err) {

        }
    }

    async findByEmail(email: string): Promise<User|undefined> {
        try {
            return undefined;
        } catch(err) {

        }
    }

    async findByUserName(userName: string): Promise<User|undefined> {
        try {
            return undefined;
        } catch(err) {

        }
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