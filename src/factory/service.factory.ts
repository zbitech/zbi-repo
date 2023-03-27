import DefaultProjectService from "../services/default.project.service";
import KubernetesControllerService from "../services/k8s.controller.service";
import { UserRepository, IdentityService, ProjectRepository, UserService, ControllerService, ProjectService } from "../interfaces";
import DefaultUserService from "../services/default.user.service";
import Auth0IdentityService from "../services/auth0.identity.service";
import BasicIdentityService from "../services/basic.identity.service";
import { getLogger } from "../libs/logger";

const IDENTITY_SERVICE = process.env.IDENTITY_SERVICE || "basic";

class ServiceFactory {

    createIdentityService(user: UserRepository): IdentityService {
        const logger = getLogger("iam-svc");

        if( IDENTITY_SERVICE === "auth0") {
            logger.info("creating auth0 identity service");
            return new Auth0IdentityService(user);
        }

        logger.info("creating basic identity service");
        return new BasicIdentityService(user);
    }

    createControllerService(): ControllerService {
        const logger = getLogger("iam-svc");

        logger.info("creating kubernetes controller service");
        return new KubernetesControllerService();
    }

    createUserService(user: UserRepository, identity: IdentityService): UserService {
        const logger = getLogger("iam-svc");

        logger.info("creating default user service");
        return new DefaultUserService(user, identity);
    }

    createProjectService(project: ProjectRepository, controller: ControllerService): ProjectService {
        const logger = getLogger("iam-svc");
        
        logger.info("creating default project service");
        return new DefaultProjectService(project, controller);
    }

}

export default new ServiceFactory();