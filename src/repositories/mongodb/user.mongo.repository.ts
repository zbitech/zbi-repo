import { IRepository } from "../repository.interface";
import { UserSchema } from "./schema.mongo";

class UserMongoRepository<UserSchema> implements IRepository<UserSchema> {

    async create(data: any): Promise<any> {
        try {
            const user = new UserSchema({...data});
            await user.save();
            return user;
        } catch(err) {
            throw err;
        }
    }

}