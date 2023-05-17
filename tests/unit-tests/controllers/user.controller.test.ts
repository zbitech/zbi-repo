import { getLogger } from "../../../src/libs/logger";
import UserController from "../../../src/controllers/user.controller";
import { Logger } from "winston";
import express, { response } from "express";
import request from "supertest";
import routes from "../../../src/routes/routes";
import app from "../../../src/app";

import beanFactory from "../../../src/factory/bean.factory";
import { UserRepository, UserService } from "../../../src/interfaces";
import { createMock } from "ts-auto-mock";
import { RoleType, UserStatusType } from "../../../src/model/zbi.enum";

routes(app);

let logger: Logger;
let userRepo: UserRepository = createMock<UserRepository>();
let userService: UserService = createMock<UserService>();

let userSvcSpy;

const admin = {email: "admin@zbitech.net", name: "Admin one", role: RoleType.admin};

const owner = {email: "owner@zbitech.net", name: "Owner one", role: RoleType.owner};
const user = {email: "user@zbitech.net", name: "User one", role: RoleType.user};

beforeAll(async () => {
    logger = getLogger("test-user-controller");
});

afterAll(async () => {

});

describe('UserController', () => {
    
    beforeEach(async () => {

        userSvcSpy = jest.spyOn(beanFactory, 'getUserService').mockImplementation(() => userService);

    });

    afterEach(async () => {

    })

    test('should authenticate admin', async() => {

    });

    test('should authenticate owner', async() => {

    });

    test('should authenticate user', async() => {

        userService.authenticateUser = jest.fn().mockReturnValue(Promise.resolve({}));

    });

    test('should fail to authenticate non-registered user', async() => {

    });

    test('should create user', async () => {

        userService.findUser = jest.fn().mockReturnValue(Promise.resolve({...admin, status: UserStatusType.active}));

       logger.info(`testing create user`);
       const res = await request(app).post("/api/users").set('Content-Type', 'application/json').send({});
//        const res = await request(app).get("/api/users");
       logger.info(`status: ${res.status}`);
       logger.info(`body: ${JSON.stringify(res.body)}`);
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
