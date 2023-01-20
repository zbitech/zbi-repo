import { IAMRepository, IAMService } from "../interfaces";
import DefaultIAMService from "../services/default.iam.service";

class ServiceFactory {

    createIAMService(iam: IAMRepository): IAMService {

        return new DefaultIAMService(iam);

//        throw new Error("no IAMService available");
    }

    createProjectService() {

        throw new Error("no ProjectService available");
    }
}

export default new ServiceFactory();