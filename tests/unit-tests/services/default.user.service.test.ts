import DefaultUserService from "../../../src/services/default.user.service";
import BasicIdentityService from "../../../src/services/basic.identity.service";
import { getLogger } from "../../../src/libs/logger";
import { Logger } from "winston";
import { ProjectRepository, ControllerService, UserRepository, IdentityService } from "../../../src/interfaces";
import { MongoMemoryDB } from "../../../src/services/mongodb-mem.service";
import UserMongoRepository from "../../../src/repositories/mongodb/user.mongo.repository";
import { User } from "../../../src/model/model";
import { LoginProvider, RoleType, UserStatusType } from "../../../src/model/zbi.enum";
import { createMock } from "ts-auto-mock";

let instance: DefaultUserService;
let logger: Logger;
let repo: UserRepository = createMock<UserRepository>();
let identity: IdentityService = createMock<IdentityService>();

const owner = {email: "owner@zbitech.net", name: "Owner one", role: RoleType.owner};
const user = {email: "user@zbitech.net", name: "User one", role: RoleType.user};


beforeAll(async () => {
    logger = getLogger("test-basic-svc");
//    await db.init();
//    await db.connect();
});

afterAll(async () => {
//    await db.close();
});

describe('DefaultUserService', () => {
    
    beforeEach(async () => {
        instance = new DefaultUserService(repo, identity);
    });

    afterEach(async () => {
//        await db.clear();
    });

    test('should create an owner', async () => {

        repo.createUser = jest.fn().mockReturnValue(Promise.resolve({...owner, status: UserStatusType.invited}));

        expect(instance).toBeInstanceOf(DefaultUserService);
        const ow = await instance.createUser(owner.email, RoleType.owner, UserStatusType.invited);
        expect(ow.email).toBe(owner.email);
        expect(ow.role).toBe(RoleType.owner);
        expect(ow.status).toBe(UserStatusType.invited);

    });

    test('should update existing user', async () => {

        const status = UserStatusType.active;
        repo.updateUser = jest.fn().mockReturnValue(Promise.resolve({...owner, role: RoleType.owner, status}));
        expect(instance).toBeInstanceOf(DefaultUserService);

        const uc = await instance.updateUser(owner.email, owner.name, status);
        expect(uc.email).toBe(owner.email);
        expect(uc.name).toBe(owner.name);
        expect(uc.status).toBe(status);
        
    });

    test('should fail to update a non-existing user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);

        //instance.updateUser();
    });

    test('should authenticate user', async () => {

        identity.authenticateUser = jest.fn().mockReturnValue(Promise.resolve({email: owner.email, valid: true, registered: true, user: owner}));
        repo.findRegistration = jest.fn().mockReturnValue(Promise.resolve({acceptedTerms: true, provider: LoginProvider.local}));
        expect(instance).toBeInstanceOf(DefaultUserService);

        const result = await instance.authenticateUser({email: owner.email, password: "password"});
        logger.info(`result = ${JSON.stringify(result)}`);
    });
    

    test('should fail to authenticate non-registered user', async () => {
        const err = new Error("could not create registration") 
        identity.authenticateUser = jest.fn().mockReturnValue(Promise.resolve({email: owner.email, valid: true, registered: false, user: owner}));
        repo.findRegistration = jest.fn().mockRejectedValue( err );
        expect(instance).toBeInstanceOf(DefaultUserService);
        
        await expect(instance.authenticateUser({email: owner.email, password: "password"})).rejects.toThrow(err);
//        logger.info(`result = ${JSON.stringify(result)}`);
    });

    test('should fail authenticate non-existent user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should change password', async () => {
        repo.validatePassword = jest.fn().mockReturnValue(Promise.resolve({...owner, registration: {acceptedTerms: true}}));
        expect(instance).toBeInstanceOf(DefaultUserService);

        const user = await instance.changePassword("owner@zbitech.net", "old_password", "new_password");

    });

    test('should register an invited user', async () => {
        repo.getUserByEmail = jest.fn().mockReturnValue(Promise.resolve({...owner}));
        expect(instance).toBeInstanceOf(DefaultUserService);

        await instance.registerUser({email: "owner@zbigech.net", name: "User", password: "password", confirmPassword: "password", acceptedTerms: true, provider: LoginProvider.local});

    });

    test('should fail to register user an uninvited user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);


    });

    test('should find users', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);


    });

    test('should find user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);


    });

    test('should not find user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);


    });

    test('should deactivate user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);

        //instance.deactivateUser();
    });

    test('should re-activate user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);

        //instance.reactivateUser();
    });

    test('should delete user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should not delete user', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should create team', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should update team', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should fail to update team', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should find teams', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should find team', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should not find team', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should find team memberships', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should not find team memberships', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should add team member', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should not add team member', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should remove team member', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should not remove team member', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should update team member', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

    test('should not update team member', async () => {
        expect(instance).toBeInstanceOf(DefaultUserService);
        
    });

});