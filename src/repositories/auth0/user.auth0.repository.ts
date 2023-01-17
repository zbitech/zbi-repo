import { User } from "../../model/model";
import { IUserRepository } from "../repository.interface";

const AUTH0_TENANT_ID = process.env.AUTH0_TENANT_ID;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_GRANT_TYPE = process.env.AUTH0_GRANT_TYPE;

const AUTH0_URL=`https://${AUTH0_TENANT_ID}.${AUTH0_DOMAIN}`

export class UserAuth0Repository implements IUserRepository {

    userRepo: IUserRepository | undefined;

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