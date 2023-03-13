import Auth0IdentityService from "../../../../src/services/auth0/auth0.identity.service";
import { getLogger } from "../../../../src/libs/logger";
import { Logger } from "winston";

let instance: Auth0IdentityService;
let logger: Logger;

beforeAll(async () => {
    logger = getLogger("test-auth0-svc");

});

afterAll(async () => {

});

describe('Auth0IdentityService', () => {
    
    beforeEach(async () => {
        instance = new Auth0IdentityService();
    });

    afterEach(async () => {

    });

    test('createUser', async () => {

        expect(instance).toBeInstanceOf(Auth0IdentityService);

    });
});