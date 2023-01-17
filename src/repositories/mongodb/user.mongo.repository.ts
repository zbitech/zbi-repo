import { User } from "../../model/model";
import { IRepository } from "../repository.interface";
import { UserSchema } from "./schema.mongo";

export class UserMongoRepository /*<User> implements IRepository<User>*/ {

    async create(data: User): Promise<User> {
        try {
            const user = new UserSchema({...data});
            await user.save();
            return createUser(user);
        } catch(err) {
            throw err;
        }
    }

    async update(data: User) {
        try {
            const user = await UserSchema.findOne({userName: data.userName});
            if(user) {
                user.email = data.email;
                user.role = data.role!;
                user.name = data.name;
                await user.save();

                return createUser(user);
            }

            return user;
        } catch(err) {

        }
    }

    async findByEmail(email: string) {
        try {
            const user = await UserSchema.findOne({email: email});
            return createUser(user);
        } catch(err) {

        }
    }

    async findByUserName(userName: string) {
        try {
            const user = await UserSchema.findOne({userName: userName});
            return createUser(user);
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