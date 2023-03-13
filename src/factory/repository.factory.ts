import { UserRepository, ProjectRepository } from "../interfaces";
import UserMongoRepository from "../repositories/mongodb/user.mongo.repository";
import ProjectMongoRepository from "../repositories/mongodb/project.mongo.repository";

const DATABASE = process.env.DATABASE || "mongodb-mem";

class RepositoryFactory {

    constructor() {
    }

    createUserRepository(): UserRepository {
        
        if(DATABASE === "mongodb-mem" || DATABASE === "mongodb") {
            return new UserMongoRepository();
        }
        
        throw new Error("No repository defined");
    }

    createProjectRepository(): ProjectRepository {
        
        if(DATABASE === "mongodb-mem" || DATABASE === "mongodb") {
            return new ProjectMongoRepository();
        }
        
        throw new Error("No repository defined");
    }
}

export default new RepositoryFactory();