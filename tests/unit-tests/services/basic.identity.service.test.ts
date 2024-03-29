import basicIdentityService from "../../../src/services/basic.identity.service";
import { getLogger } from "../../../src/libs/logger";
import { Logger } from "winston";
import { ProjectRepository, ControllerService, UserRepository } from "../../../src/interfaces";
import { MongoMemoryDB } from "../../../src/services/mongodb-mem.service";
import UserMongoRepository from "../../../src/repositories/mongodb/user.mongo.repository";
import { LoginProvider, RoleType, UserStatusType } from "../../../src/model/zbi.enum";
import model from "../../../src/repositories/mongodb/mongo.model";
import { hashPassword } from "../../../src/libs/auth.libs";

let instance: any;
let logger: Logger;
let db: MongoMemoryDB = new MongoMemoryDB();
let repo: UserRepository = new UserMongoRepository();

beforeAll(async () => {
    logger = getLogger("test-basic-id-svc");
    await db.init();
    await db.connect();
});

afterAll(async () => {
    await db.close();
});

describe('BasicIdentityService', () => {
    
    beforeEach(async () => {
        instance = basicIdentityService;
    });

    afterEach(async () => {
        await db.clear();
    });

    test('should authenticate user', async () => {

        const password = await hashPassword("password") as string;
//        const user = await model.userModel.create({email: "test@zbitech.net", name: "Tester", status: UserStatusType.active, role: RoleType.owner, password});        
//        const reg = await model.registrationModel.create({email: "test@zbitech.net", acceptedTerms: true});

        const user = await model.userModel.create({email: "test@zbitech.net", name: "Owner", role: RoleType.owner, status: UserStatusType.active, password, registration: {acceptedTerms: true, provider: LoginProvider.local}});

        const result = await instance.authenticateUser({email: user.email, password: "password"});

        logger.info(`result = ${JSON.stringify(result)}`);
    });

    test('should fail authentication', async () => {
        
    });

});