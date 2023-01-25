import { IAMRepository, ProjectRepository } from "../interfaces";
import IAMMongoRepository from "../repositories/mongodb/iam.mongo.repository";
import ProjectMongoRepository from "../repositories/mongodb/project.mongo.repository";

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

    createProjectRepository(): ProjectRepository {
        
        if(DATABASE === "mongodb-mem" || DATABASE === "mongodb") {
            return new ProjectMongoRepository();
        }
        
        throw new Error("No repository defined");
    }
}

export default new RepositoryFactory();