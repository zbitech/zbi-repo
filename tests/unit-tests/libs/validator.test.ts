import { Logger } from "winston";
import { getLogger } from "../../../src/libs/logger";
import { validateObject, validateResource } from "../../../src/libs/validator";
import { schemas } from "../../../src/model/schema";


let logger: Logger;

beforeAll(async () => {
    logger = getLogger("test-basic-svc");
});

afterAll(async () => {
});

describe('validateObject', () => {
    
    beforeEach(async () => {

    });

    afterEach(async () => {
    });


    test('should validate user credentials', async () => {

        console.info(`running validator test`)
        const request = {body: {email: "user@zbitech.net", password: "password"}};
        const result = await validateObject(schemas.localAuthRequest, request);

        console.info(`validation result: ${JSON.stringify(result)}`);
    });


    test('should fail to validate credentials without email and password', async () => {

        console.info(`running validator test`)
        const request = {body: {email: "", password: ""}};
        const result = await validateObject(schemas.localAuthRequest, request);
//        const result = validateResource(schemas.localLogin, request);

        console.info(`validation result: ${JSON.stringify(result)}`);
    });

    test('should fail to validate credentials with incorrect email', async () => {

        console.info(`running validator test`)
        const request = {body: {email: "user", password: "password"}};
        const result = await validateObject(schemas.localAuthRequest, request);
//        const result = validateResource(schemas.localLogin, request);

        console.info(`validation result: ${JSON.stringify(result)}`);
    });


    test('should validate an external auth request', async() => {
        const request = {query: {code: "12klklasdklkfas8kladfsd"}};
        const result = await validateObject(schemas.externalAuthRequest, request);

        console.info(`validation result: ${JSON.stringify(result)}`);
    });

    test('should fail to validate an external auth request without code', async() => {
        const request = {query: {}};
        const result = await validateObject(schemas.externalAuthRequest, request);

        console.info(`validation result: ${JSON.stringify(result)}`);
    });

    test('should validate local registration request', async() => {
        const request = {body: {}};
        const result = await validateObject(schemas.registerLocalRequest, request);

    });

});