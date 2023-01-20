import { IAMRepository } from "../interfaces";
import IAMMongoRepository from "../repositories/mongodb/iam.mongo.repository";

const DATABASE = process.env.DATABASE || "mongodb-mem";

class RepositoryFactory {

    constructor() {
    }

    createIAMRepository(): IAMRepository {
        
        if(DATABASE === "mongodb-mem" || DATABASE === "mongodb") {
            return new IAMMongoRepository();
        }
        
        throw new Error("No repository defined");
    }

    createProjectRepository() {
        
        if(DATABASE === "mongodb-mem" || DATABASE === "mongodb") {
        }
        
        throw new Error("No repository defined");
    }
}

export default new RepositoryFactory();