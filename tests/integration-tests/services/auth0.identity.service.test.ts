import Auth0IdentityService from "../../../src/services/auth0.identity.service";
import { getLogger } from "../../../src/libs/logger";
import { Logger } from "winston";
import { MongoMemoryDB } from "../../../src/services/mongodb-mem.service";
import UserMongoRepository from "../../../src/repositories/mongodb/user.mongo.repository";

let instance: Auth0IdentityService;
let logger: Logger;
let db: MongoMemoryDB = new MongoMemoryDB();

beforeAll(async () => {
    logger = getLogger("test-auth0-svc");
    await db.init();
    await db.connect();
});

afterAll(async () => {
    await db.close();
});

describe('Auth0IdentityService', () => {
    
    beforeEach(async () => {
        instance = new Auth0IdentityService(new UserMongoRepository());
    });

    afterEach(async () => {

    });

    test('createUser', async () => {

        expect(instance).toBeInstanceOf(Auth0IdentityService);

    });
});