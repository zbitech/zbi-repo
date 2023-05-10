import DefaultUserService from "../../../src/services/default.user.service";
import BasicIdentityService from "../../../src/services/basic.identity.service";
import { getLogger } from "../../../src/libs/logger";
import { Logger } from "winston";
import { ProjectRepository, ControllerService, UserRepository, IdentityService } from "../../../src/interfaces";
import { MongoMemoryDB } from "../../../src/services/mongodb-mem.service";
import UserMongoRepository from "../../../src/repositories/mongodb/user.mongo.repository";
import { RoleType, UserStatusType } from "../../../src/model/zbi.enum";

let instance: DefaultUserService;
let logger: Logger;
let db: MongoMemoryDB = new MongoMemoryDB();
let repo: UserRepository = new UserMongoRepository();
let identity: IdentityService = new BasicIdentityService(repo);

beforeAll(async () => {
    logger = getLogger("test-basic-svc");
    await db.init();
    await db.connect();
});

afterAll(async () => {
    await db.close();
});

describe('DefaultUserService', () => {
    
    beforeEach(async () => {
        instance = new DefaultUserService(repo, identity);
    });

    afterEach(async () => {
        await db.clear();
    });

    test('should create an owner', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        const owner = await instance.createUser("owner@zbitech.net", "Owner One", RoleType.owner, UserStatusType.invited);
    });

    test('should update existing user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should fail to update a non-existing user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should get user by email', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should set password', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should deactivate user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should activate user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should delete user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should authenticate user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should fail authentication', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should register user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

});