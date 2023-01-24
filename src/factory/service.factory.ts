import { DefaultProjectService } from "../services/default.project.service";
import { IAMRepository, IAMService, ProjectRepository } from "../interfaces";
import DefaultIAMService from "../services/default.iam.service";

class ServiceFactory {

    createIAMService(iam: IAMRepository): IAMService {
        return new DefaultIAMService(iam);
    }

    createProjectService(project: ProjectRepository) {
        return new DefaultProjectService(project);
    }
}

export default new ServiceFactory();