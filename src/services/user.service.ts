import { UserMongoRepository } from "../repositories/mongodb/user.mongo.repository";
import { IAMRepository } from "../repositories/repository.interface";

export default class UserService {

    private iamRepository: IAMRepository|undefined;

    constructor() {
    }

    setUserRepository(repo: IAMRepository) {
        this.iamRepository = repo;
    }
}