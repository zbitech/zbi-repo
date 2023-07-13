import { AppErrorType, ApplicationError } from "../libs/errors";
import { LoginProvider, RoleType, UserStatusType } from "../model/zbi.enum";
import basicIdentityService from "../services/basic.identity.service";
import googleIdentityService from "../services/google.identity.service";
import jobService from "../services/job.service";
import { ControllerService, Database, IAccessService, IJobService, IdentityService, ProjectRepository, ProjectService, UserRepository, UserService } from "../interfaces";
import databaseFactory from "./database.factory";
import repositoryFactory from "./repository.factory";
import controllerService from '../services/k8s.controller.service';
import projectService from '../services/default.project.service';
import userService from '../services/default.user.service';
import accessService from "../services/access.service";
import { mainLogger as logger } from "../libs/logger";
import config from "config";
import { hashPassword } from "../libs/auth.libs";
import model from "../repositories/mongodb/mongo.model";

const CREATE_ADMIN = config.get<boolean>("createAdmin");
const ADMIN_EMAIL = config.get<string>("adminEmail");
const ADMIN_PASSWORD = config.get<string>("adminPassword");

class BeanFactory {

    private database: Map<string, any>;
    private repositories: Map<string, any>;

    constructor() {

        this.database = new Map();
        this.repositories = new Map();

        try {
            this.database.set("database", databaseFactory.createDatabase());
            this.repositories.set("user", repositoryFactory.createUserRepository());
            this.repositories.set("project", repositoryFactory.createProjectRepository());

            //console.log(`bean factory initialized ...`);
        } catch (err: any) {
            console.error(`Failed to initialize beanFactory - ${(err)}`);            
        }
    }

    async init() {
        let db: Database = this.database.get("database");
        await db.init();
        await db.connect();

        if(CREATE_ADMIN) {

            const user = await model.userModel.findOne({email: ADMIN_EMAIL})
            logger.debug(`found user - ${JSON.stringify(user)}`);
            if(!user) {
                const password = await hashPassword(ADMIN_PASSWORD);
                //logger.debug(`creating - email -> ${ADMIN_EMAIL} password -> ${pass} [${password}]`);        
                const uc = model.userModel({name: "Admin", email: ADMIN_EMAIL, password: password, role: RoleType.admin, status: UserStatusType.active, registration: {acceptedTerms: true, provider: LoginProvider.local}});
                await uc.save();
                logger.info(`created admin user - ${ADMIN_EMAIL}`);
            }
        }
        
    }

    getUserRepository(): UserRepository {
        return this.getRepository("user");
    }

    getProjectRepository(): ProjectRepository {
        return this.getRepository("project");
    }

    getIdentityService(provider: LoginProvider): IdentityService {
        if(provider === LoginProvider.local) {
            return basicIdentityService;
        } else if(provider === LoginProvider.google ) {
            return googleIdentityService;
        }

        throw new ApplicationError(AppErrorType.INVALID_LOGIN_PROVIDER, `unknown login provider - ${provider}`);
    }

    getControllerService(): ControllerService {
        return controllerService;
    }

    getUserService(): UserService {
        return userService;
    }

    getProjectService(): ProjectService {
        return projectService;
    }

    getAccessService(): IAccessService {
        return accessService;
    }

    getJobService(): IJobService {
        return jobService;
    }

    getRepository(name: string) {
        const repo = this.repositories.get(name);
        if(repo) {
            return repo;
        }

        throw new Error("repository does not exist!");
    }

    getDatabase(name: string) {
        return this.database.get("database");
    }
}

export default new BeanFactory();