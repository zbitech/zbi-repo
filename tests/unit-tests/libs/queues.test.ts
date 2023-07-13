import { Logger } from "winston";
import { getLogger } from "../../../src/libs/logger";
import { validateObject } from "../../../src/libs/validator";
import { schemas } from "../../../src/model/schema";
import { signJwtAccessToken, signJwtRefreshToken, verifyJwtAccessToken, verifyJwtRefreshToken } from "../../../src/libs/auth.libs";
import { RoleType } from "../../../src/model/zbi.enum";
import * as queues from "../../../src/libs/queues";

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


    test('should init queue', async () => {

        const result = await queues.createProject("test");
        console.log(`Result = ${JSON.stringify(result)}`);
        await queues.closeQueue();
    });


});