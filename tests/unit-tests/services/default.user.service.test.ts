import defaultUserService from "../../../src/services/default.user.service";
import basicIdentityService from "../../../src/services/basic.identity.service";
import { getLogger } from "../../../src/libs/logger";
import { Logger } from "winston";
import { ProjectRepository, ControllerService, UserRepository, IdentityService } from "../../../src/interfaces";
import { MongoMemoryDB } from "../../../src/services/mongodb-mem.service";
import UserMongoRepository from "../../../src/repositories/mongodb/user.mongo.repository";
import { User } from "../../../src/model/model";
import { LoginProvider, RoleType, UserStatusType } from "../../../src/model/zbi.enum";
import { createMock } from "ts-auto-mock";
import beanFactory from "../../../src/factory/bean.factory";

let instance: any;
let logger: Logger;
let repo: UserRepository = createMock<UserRepository>();
let identity: IdentityService = createMock<IdentityService>();

let idSvcSpy;

const owner = {email: "owner@zbitech.net", name: "Owner one", role: RoleType.owner};
const user = {email: "user@zbitech.net", name: "User one", role: RoleType.user};


beforeAll(async () => {
    logger = getLogger("test-basic-svc");
});

afterAll(async () => {
});

describe('DefaultUserService', () => {
    
    beforeEach(async () => {

        idSvcSpy = jest.spyOn(beanFactory, 'getIdentityService').mockImplementation(() => identity);
        jest.spyOn(beanFactory, 'getUserRepository').mockImplementation(() => repo );

        instance = defaultUserService;
    });

    afterEach(async () => {
    });

    test('should create an owner', async () => {

        repo.createUser = jest.fn().mockReturnValue(Promise.resolve({...owner, status: UserStatusType.invited}));

        const ow = await instance.createUser(owner.email, owner.role, UserStatusType.invited);
        expect(ow.email).toBe(owner.email);
        expect(ow.role).toBe(owner.role);
        expect(ow.status).toBe(UserStatusType.invited);

    });

    test('should create a team member', async () => {

        repo.createUser = jest.fn().mockReturnValue(Promise.resolve({...user, status: UserStatusType.invited}));

        const ow = await instance.createUser(user.email, owner.role, UserStatusType.invited);
        expect(ow.email).toBe(user.email);
        expect(ow.role).toBe(user.role);
        expect(ow.status).toBe(UserStatusType.invited);

    });

    test('should update existing user', async () => {

        const status = UserStatusType.active;
        repo.updateUser = jest.fn().mockReturnValue(Promise.resolve({...owner, role: RoleType.owner, status}));

        const uc = await instance.updateUser(owner.email, owner.name, status);
        expect(uc.email).toBe(owner.email);
        expect(uc.name).toBe(owner.name);
        expect(uc.status).toBe(status);
        
    });

    test('should fail to update a non-existing user', async () => {


    });

    test('should authenticate user', async () => {

        identity.authenticateUser = jest.fn().mockReturnValue(Promise.resolve({email: owner.email, valid: true, registered: true, user: owner}));
        repo.findRegistration = jest.fn().mockReturnValue(Promise.resolve({acceptedTerms: true, provider: LoginProvider.local}));

        const result = await instance.authenticateUser({email: owner.email, password: "password"}, LoginProvider.local);
        logger.info(`result = ${JSON.stringify(result)}`);
    });
    

    test('should fail to authenticate non-registered user', async () => {
        const err = new Error("could not create registration") 
        identity.authenticateUser = jest.fn().mockReturnValue(Promise.resolve({email: owner.email, valid: true, registered: false, user: owner}));
        repo.findRegistration = jest.fn().mockRejectedValue( err );
        
        await expect(instance.authenticateUser({email: owner.email, password: "password"}, LoginProvider.local)).rejects.toThrow(err);
//        logger.info(`result = ${JSON.stringify(result)}`);
    });

    test('should fail authenticate non-existent user', async () => {
        
    });

    test('should change password', async () => {

        repo.validatePassword = jest.fn().mockReturnValue(Promise.resolve({...owner, registration: {acceptedTerms: true}}));       
        const user = await instance.changePassword("owner@zbitech.net", "old_password", "new_password");

    });

    test('should register an invited user', async () => {

        repo.getUserByEmail = jest.fn().mockReturnValue(Promise.resolve({...owner}));
        await instance.registerUser({email: "owner@zbigech.net", name: "User", password: "password", confirmPassword: "password", acceptedTerms: true, provider: LoginProvider.local});

    });

    test('should fail to register user an uninvited user', async () => {


    });

    test('should find users', async () => {


    });

    test('should find user', async () => {


    });

    test('should not find user', async () => {


    });

    test('should deactivate user', async () => {

        //instance.deactivateUser();
    });

    test('should re-activate user', async () => {

        //instance.reactivateUser();
    });

    test('should delete user', async () => {
        
    });

    test('should not delete user', async () => {
        
    });

    test('should create team', async () => {
        
    });

    test('should update team', async () => {
        
    });

    test('should fail to update team', async () => {
        
    });

    test('should find teams', async () => {
        
    });

    test('should find team', async () => {
        
    });

    test('should not find team', async () => {
        
    });

    test('should find team memberships', async () => {
        
    });

    test('should not find team memberships', async () => {
        
    });

    test('should add team member', async () => {
        
    });

    test('should not add team member', async () => {
        
    });

    test('should remove team member', async () => {
        
    });

    test('should not remove team member', async () => {
        
    });

    test('should update team member', async () => {
        
    });

    test('should not update team member', async () => {
        
    });

});