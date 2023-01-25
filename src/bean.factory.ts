import { Database, IAMRepository } from "./interfaces";
import IAMMongoRepository from "./repositories/mongodb/iam.mongo.repository";
import databaseFactory from "./factory/database.factory";
import repositoryFactory from "./factory/repository.factory";
import serviceFactory from "./factory/service.factory";
import UserController from "./controllers/user.controller";
import ProjectController from "./controllers/project.controller";

class BeanFactory {

    private database: Map<string, any>;
    private repositories: Map<string, any>;
    private services: Map<string, any>;
    private controllers: Map<string, any>;

    constructor() {

        this.database = new Map();
        this.repositories = new Map();
        this.services = new Map();
        this.controllers = new Map();

        this.repositories.set("iam", repositoryFactory.createIAMRepository());
        this.repositories.set("project", repositoryFactory.createProjectRepository());

        this.services.set("iam", serviceFactory.createIAMService(this.getRepository("iam")));
        this.services.set("project", serviceFactory.createProjectService(this.getRepository("project")));

        this.controllers.set("user", new UserController());
        this.controllers.set("project", new ProjectController());

        this.database.set("database", databaseFactory.createDatabase());
    }

    async init() {
        let db: Database = this.database.get("database");
        await db.init();
        await db.connect();
    }

    getRepository(name: string) {
        const repo = this.repositories.get(name);
        if(repo) {
            return repo;
        }

        throw new Error("repository does not exist!");
    }

    getService(name: string) {
        const service = this.services.get(name);
        if(service) {
            return service;
        }

        throw new Error("repository does not exist!");
    }

    getDatabase(name: string) {
        return this.database.get("database");
    }

    getController(name: string) {
        const bean = this.controllers.get(name);
        if(bean) {
            return bean;
        }

        throw new Error("controller does not exist!");
    }
}

export default new BeanFactory();