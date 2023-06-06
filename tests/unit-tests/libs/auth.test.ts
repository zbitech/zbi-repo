import { Logger } from "winston";
import { getLogger } from "../../../src/libs/logger";
import { validateObject, validateResource } from "../../../src/libs/validator";
import { schemas } from "../../../src/model/schema";
import { signJwtAccessToken, signJwtRefreshToken, verifyJwtAccessToken, verifyJwtRefreshToken } from "../../../src/libs/auth.libs";
import { RoleType } from "../../../src/model/zbi.enum";

let logger: Logger;
const admin = {email: "admin@zbitech.net", name: "Admin one", role: RoleType.admin};
const owner = {email: "owner@zbitech.net", name: "Owner one", role: RoleType.owner};
const user = {email: "user@zbitech.net", name: "User one", role: RoleType.user};

beforeAll(async () => {
    logger = getLogger("test-basic-svc");
});

afterAll(async () => {
});

describe('auth library', () => {
    
    beforeEach(async () => {

    });

    afterEach(async () => {
    });


    test('should verify access token', async () => {
        const token = signJwtAccessToken(admin);
        const result = verifyJwtAccessToken(token);

        console.log(`Result = ${JSON.stringify(result)}`);
    });

    test('should verify refresh token', async () => {
        const token = signJwtRefreshToken(admin);
        const result = verifyJwtRefreshToken(token);

        console.log(`Result = ${JSON.stringify(result)}`);
    });

});