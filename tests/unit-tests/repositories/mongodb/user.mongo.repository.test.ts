import { MongoMemoryDB } from "../../../../src/services/mongodb-mem.service";
import UserMongoRepository from "../../../../src/repositories/mongodb/user.mongo.repository";
import * as helper from "../../../../src/repositories/mongodb/helper";
import model from "../../../../src/repositories/mongodb/mongo.model";
import { User, QueryParam } from "../../../../src/model/model";
import { RoleType, UserStatusType, UserFilterType, FilterConditionType, LoginProvider } from "../../../../src/model/zbi.enum";
import { getLogger } from "../../../../src/libs/logger";
import { Logger } from "winston";
import { hashPassword } from "../../../../src/libs/auth.libs";

let instance: UserMongoRepository;
let db: MongoMemoryDB = new MongoMemoryDB();
let logger: Logger;

beforeAll(async () => {
    logger = getLogger("test-user-repo");
    await db.init(); 
    await db.connect();
});

afterAll(async () => {
    await db.close();
});

describe('UserMongoRepository', () => {
    
    beforeEach(async () => {
        instance = new UserMongoRepository();
    });

    afterEach(async () => {
        await db.clear();
    })

    test('should create a user', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);
        const user: User = {email: "user1@zbitech.net", name: "User One", role: RoleType.owner};

        const newUser = await instance.createUser(user.email, user.role as RoleType, UserStatusType.invited);
        logger.info(`created user ${JSON.stringify(newUser)}`);
    });

    test('should update a user', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);
        const user = await model.userModel.create({email: "test@zbitech.net", name: "Tester", status: UserStatusType.active, role: RoleType.owner});
        logger.info(`created user ${JSON.stringify(user)}`);

        const user2: User = helper.createUser(user);
        logger.info(`converted user ${JSON.stringify(user2)}`);
//        user2.email = "test2@zbitech.net";
        user2.name = "test2";
        logger.info(`updated user to ${JSON.stringify(user2)}`);

        
        const updated = await instance.updateUser(user2.email, user2.name, user2.status as UserStatusType);
        logger.info(`found user => ${JSON.stringify(updated)}`);
        /*
        expect(updated.email).toBe(user2.email);
        expect(updated.name).toBe(user2.name);*/
    });

    test('should find users', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);

        const users = await Promise.all( ['user1', 'user2', 'user3', 'user4', 'user5'].map(async (user) => {
            await model.userModel.create({username: user, email: `${user}@zbitech.net`, name: user, status: UserStatusType.active, role: RoleType.owner});
        }));

        const all_users = await instance.findUsers({}, users.length, 1);
        logger.info(`found users ${JSON.stringify(all_users)}`);

        const users2 = await instance.findUsers({}, 2, 1);
        logger.info(`found 2 users ${JSON.stringify(users2)}`);

    });

    test('should find a user', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);
        const user = await model.userModel.create({username: "test", email: "test@zbitech.net", name: "Tester", status: UserStatusType.active, role: RoleType.owner});
        const user2 = await model.userModel.create({username: "test2", email: "test2@zbitech.net", name: "Tester 2", status: UserStatusType.active, role: RoleType.owner});

        const byUser: QueryParam = {name: UserFilterType.username, condition: FilterConditionType.equal, value: user.username};
        let _user = await instance.findUser(byUser);
        expect(_user.email).toBe(user.email);

        const byEmail: QueryParam = {name: UserFilterType.email, condition: FilterConditionType.equal, value: user2.email};
        _user = await instance.findUser(byEmail);
        expect(_user.email).toBe(user2.email);
    });

    test('should find a registration', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);

        const r = await model.userModel.create({email: "test@zbitech.net", name: "Owner", role: RoleType.owner, status: UserStatusType.active, registration: {acceptedTerms: true, provider: LoginProvider.local}});
        logger.info(`created registration: ${JSON.stringify(r)}`);

        const reg = await instance.findRegistration(r.email);
        logger.info(`found registration - ${JSON.stringify(reg)}`);
    });

    test('should create a registration', async () => {

        const r = await model.userModel.create({email: "test@zbitech.net", name: "Owner", role: RoleType.owner, status: UserStatusType.invited, registration: {acceptedTerms: false}});

        expect(instance).toBeInstanceOf(UserMongoRepository);

        const reg = await instance.createRegistration("test@zbitech.net", "Tester", LoginProvider.local);
        logger.info(`created registration - ${JSON.stringify(reg)}`);
    });

    test('should activate user', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);
        const user = await model.userModel.create({username: "test", email: "test@zbitech.net", name: "Tester", status: UserStatusType.inactive, role: RoleType.owner});

        const a_user = await instance.activateUser(user.email);
        expect(a_user.status).toBe(UserStatusType.active);

    });

    test('should deactivate user', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);
        const user = await model.userModel.create({username: "test", email: "test@zbitech.net", name: "Tester", status: UserStatusType.active, role: RoleType.owner});

        const a_user = await instance.deactivateUser(user.email);
        expect(a_user.status).toBe(UserStatusType.inactive);
    });

    test('should delete user', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);
        const user = await model.userModel.create({username: "test", email: "test@zbitech.net", name: "Tester", status: UserStatusType.active, role: RoleType.owner});

        await instance.deleteUser(user.email);
    });

    test('should set password', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);

        const password = await hashPassword("password") as string;
        const user = await model.userModel.create({username: "test", email: "test@zbitech.net", name: "Tester", status: UserStatusType.active, role: RoleType.owner});
        await instance.setPassword(user.email, password);
    }); 

    test('should validate password', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);

        const password = await hashPassword("password") as string;
        const user = await model.userModel.create({username: "test", email: "test@zbitech.net", name: "Tester", status: UserStatusType.active, role: RoleType.owner, password});

        const uc = await instance.validatePassword(user.email, "password");
        logger.info(`user validated = ${JSON.stringify(uc)}`);
    });
    
    test('should create a team', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);
        const user = await model.userModel.create({username: "test", email: "test@zbitech.net", name: "Tester", status: UserStatusType.active, role: RoleType.owner});

        const team = await instance.createTeam(user._id.toString(), "My Team");
        logger.info(`created team: ${JSON.stringify(team)}`);
    });

    test('should find a team', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);
        const owner = await model.userModel.create({username: "owner", email: "owner@zbitech.net", name: "Resource Owner", status: UserStatusType.active, role: RoleType.owner});
        const user = await model.userModel.create({username: "user", email: "user@zbitech.net", name: "Resource User", status: UserStatusType.active, role: RoleType.user});

        const team = await model.teamModel.create({name: "My Team", owner: owner._id, members:[
            {user: user._id, role: RoleType.user}
        ]});

        const newTeam = await instance.findTeam(team._id.toString());
        logger.info(`found a team ${JSON.stringify(newTeam)}`);
    });

    test('should find teams', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);

        const owner1 = await model.userModel.create({username: "owner1", email: "owner1@zbitech.net", name: "Resource Owner1", status: UserStatusType.active, role: RoleType.owner});
        const user1 = await model.userModel.create({username: "user1", email: "user1@zbitech.net", name: "Resource User1", status: UserStatusType.active, role: RoleType.user});
        const team1 = await model.teamModel.create({name: "My Team 1", owner: owner1._id, members:[{user: user1._id, role: RoleType.user}]});

        const owner2 = await model.userModel.create({username: "owner2", email: "owner2@zbitech.net", name: "Resource Owner2", status: UserStatusType.active, role: RoleType.owner});
        const user2 = await model.userModel.create({username: "user2", email: "user2@zbitech.net", name: "Resource User2", status: UserStatusType.active, role: RoleType.user});
        const team2 = await model.teamModel.create({name: "My Team 2", owner: owner2._id, members:[{user: user2._id, role: RoleType.user}]});

        const teams = await instance.findTeams(10, 1);
        logger.info(`found teams ${JSON.stringify(teams)}`);
    });

    test('should find team memberships', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);

        const user1 = await model.userModel.create({username: "user1", email: "user1@zbitech.net", name: "Resource User1", status: UserStatusType.active, role: RoleType.user});
        const user2 = await model.userModel.create({username: "user2", email: "user2@zbitech.net", name: "Resource User2", status: UserStatusType.active, role: RoleType.user});
        const owner1 = await model.userModel.create({username: "owner1", email: "owner1@zbitech.net", name: "Resource Owner1", status: UserStatusType.active, role: RoleType.owner});
        const team1 = await model.teamModel.create({name: "My Team 1", owner: owner1._id, members:[{user: user1._id, role: RoleType.user}, {user: user2._id, role: RoleType.user}]});
        const owner2 = await model.userModel.create({username: "owner2", email: "owner2@zbitech.net", name: "Resource Owner2", status: UserStatusType.active, role: RoleType.owner});
        const team2 = await model.teamModel.create({name: "My Team 2", owner: owner2._id, members:[{user: user1._id, role: RoleType.user}, {user: user2._id, role: RoleType.user}]});

        const teams = await model.teamModel.find()
//        console.log("Teams: ", JSON.stringify(teams));

        const memberships = await instance.findTeamMemberships(user1._id.toString());
        logger.info(`found memberships ${JSON.stringify(memberships)}`);
    });

    test('should add team membership', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);
        const user1 = await model.userModel.create({username: "user1", email: "user1@zbitech.net", name: "Resource User1", status: UserStatusType.active, role: RoleType.user});
        const owner1 = await model.userModel.create({username: "owner1", email: "owner1@zbitech.net", name: "Resource Owner1", status: UserStatusType.active, role: RoleType.owner});
        const team1 = await model.teamModel.create({name: "My Team 1", owner: owner1._id});

        const team = await instance.addTeamMembership(team1._id as string, user1.username);
        logger.info(`added member ${JSON.stringify(team)}`);
    });

    test('should remove add team membership', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);

    });

    test('should update team membership', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);

    });

    test('should find team membership', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);

    });
});
