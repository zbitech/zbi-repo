import DefaultProjectService from "../services/default.project.service";
import KubernetesControllerService from "../services/k8s.controller.service";
import { UserRepository, IdentityService, ProjectRepository, UserService, ControllerService, ProjectService } from "../interfaces";
import DefaultUserService from "../services/default.user.service";
import Auth0IdentityService from "src/services/auth0.identity.service";

class ServiceFactory {

    createIdentityService(user: UserRepository): IdentityService {
        return new Auth0IdentityService(user);
    }

    createControllerService(): ControllerService {
        return new KubernetesControllerService();
    }

    createUserService(user: UserRepository, identity: IdentityService): UserService {
        return new DefaultUserService(user, identity);
    }

    createProjectService(project: ProjectRepository, controller: ControllerService): ProjectService {
        return new DefaultProjectService(project, controller);
    }

}

export default new ServiceFactory();