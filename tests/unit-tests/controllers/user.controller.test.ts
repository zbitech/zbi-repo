import { getLogger } from "../../../src/libs/logger";
import { Logger } from "winston";
import express, { response } from "express";
import request from "supertest";
import routes from "../../../src/routes/routes";
import app from "../../../src/app";
import * as mock_data from "../../mock/mock_data"

import beanFactory from "../../../src/factory/bean.factory";
import { IdentityService, UserRepository, UserService } from "../../../src/interfaces";
import { createMock } from "ts-auto-mock";
import { RoleType, UserStatusType } from "../../../src/model/zbi.enum";
import { HttpStatusCode } from "axios";

routes(app);

let logger: Logger;
let userRepo: UserRepository = createMock<UserRepository>();
let userService: UserService = createMock<UserService>();
let identityService: IdentityService = createMock<IdentityService>();

let userSvcSpy;

const admin = {email: "admin@zbitech.net", name: "Admin one", role: RoleType.admin, status: UserStatusType.active};
const owner = {email: "owner@zbitech.net", name: "Owner one", role: RoleType.owner, status: UserStatusType.active};
const user = {email: "user@zbitech.net", name: "User one", role: RoleType.user, status: UserStatusType.active};

beforeAll(async () => {
    logger = getLogger("test-user-controller");
});

afterAll(async () => {

});

describe('UserController', () => {
    
    beforeEach(async () => {

        userSvcSpy = jest.spyOn(beanFactory, 'getUserService').mockImplementation(() => userService);
        jest.spyOn(beanFactory, 'getIdentityService').mockImplementation(() => identityService);

    });

    afterEach(async () => {

    })

    test('should authenticate user', async() => {
        const auth = mock_data.createValidAuthResult(admin);
        userService.authenticateUser = jest.fn().mockReturnValue(Promise.resolve(auth));

        const result = await request(app).post("/api/oauth/local").set('Content-Type', 'application/json').send({email: "owner@zbitech.net", password: "password"});
        expect(result.statusCode).toBe(HttpStatusCode.Ok);

    });

    test('should fail to authenticate non-registered user', async() => {
        const auth = {valid: true, registered: false};
        userService.authenticateUser = jest.fn().mockReturnValue(Promise.resolve(auth));

        const result = await request(app).post("/api/oauth/local").set('Content-Type', 'application/json').send({email: "owner@zbitech.net", password: "password"});
        expect(result.statusCode).toBe(HttpStatusCode.Forbidden);

    });

    test('should fail to authenticate un-authorized user', async() => {
        const auth = {valid: false, registered: false};
        userService.authenticateUser = jest.fn().mockReturnValue(Promise.resolve(auth));

        const result = await request(app).post("/api/oauth/local").set('Content-Type', 'application/json').send({email: "owner@zbitech.net", password: "password"});
        expect(result.statusCode).toBe(HttpStatusCode.Unauthorized);
    });

    test('should invite new resource owner', async () => {

        const auth = mock_data.createValidAuthResult(admin);

        //userService.findUser = jest.fn().mockReturnValue(Promise.resolve({...admin, status: UserStatusType.active}));

       console.info(`inviting resource owner`);
       const res = await request(app).post("/api/users").set('Content-Type', 'application/json').set('Authorization', `Bearer: ${auth.accessToken}`).send({});
//        const res = await request(app).get("/api/users");
       console.info(`status: ${res.status}`);
       console.info(`body: ${JSON.stringify(res.body)}`);
    });

    test('should invite new team member', async() => {

    });

    test('should register new owner', async() => {

    });

    test('should register new team member', async() => {

    });

    test('should find users', async() => {

    });

});
