import { ControllerService, Database, IdentityService, ProjectRepository, ProjectService, UserRepository, UserService } from "../interfaces";
import databaseFactory from "./database.factory";
import repositoryFactory from "./repository.factory";
import serviceFactory from "./service.factory";

class BeanFactory {

    private database: Map<string, any>;
    private repositories: Map<string, any>;
    private services: Map<string, any>;

    constructor() {

        this.database = new Map();
        this.repositories = new Map();
        this.services = new Map();

        this.repositories.set("user", repositoryFactory.createUserRepository());
        this.repositories.set("project", repositoryFactory.createProjectRepository());

        this.services.set("identity", serviceFactory.createIdentityService(this.getUserRepository()));
        this.services.set("controller", serviceFactory.createControllerService());
        this.services.set("user", serviceFactory.createUserService(this.getUserRepository(), this.getIdentityService()));
        this.services.set("project", serviceFactory.createProjectService(this.getProjectRepository(), this.getControllerService()));

        this.database.set("database", databaseFactory.createDatabase());
    }

    async init() {
        let db: Database = this.database.get("database");
        await db.init();
        await db.connect();
    }

    getUserRepository(): UserRepository {
        return this.getRepository("user");
    }

    getProjectRepository(): ProjectRepository {
        return this.getRepository("project");
    }

    getIdentityService(): IdentityService {
        return this.getService("identity");
    }

    getControllerService(): ControllerService {
        return this.getService("controller");
    }

    getUserService(): UserService {
        return this.getService("user");
    }

    getProjectService(): ProjectService {
        return this.getService("project");
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
}

export default new BeanFactory();