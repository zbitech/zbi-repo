import DefaultProjectService from "../services/default.project.service";
import KubernetesControllerService from "../services/k8s.controller.service";
import { IAMRepository, IAMService, IdentityService, ProjectRepository, UserService } from "../interfaces";
import DefaultUserService from "../services/default.user.service";
import Auth0IdentityService from "src/services/auth0/auth0.identity.service";

class ServiceFactory {

    createIdentityService(): IdentityService {
        return new Auth0IdentityService();
    }

    createUserService(iam: IAMRepository): UserService {
        return new DefaultUserService(iam, this.createIdentityService());
    }

    createProjectService(project: ProjectRepository) {
        return new DefaultProjectService(project, new KubernetesControllerService());
    }

}

export default new ServiceFactory();