import { MongoMemoryDB } from "../../../../src/services/mongodb-mem.service";
import UserMongoRepository from "../../../../src/repositories/mongodb/user.mongo.repository";
import model from "../../../../src/repositories/mongodb/mongo.model";
import { User } from "../../../../src/model/model";
import { RoleType, UserStatusType } from "../../../../src/model/zbi.enum";
import { getLogger } from "../../../../src/libs/logger";
import { Logger } from "winston";

let instance: UserMongoRepository;
let db: MongoMemoryDB = new MongoMemoryDB();
let logger: Logger;

beforeAll(async () => {
    logger = getLogger("test-iam-repo");
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
        const user: User = {username: "user1", email: "user1@zbitech.net", name: "User One", role: RoleType.owner};

        const newUser = await instance.createUser(user);
        logger.info("created: ", JSON.stringify(newUser));
    });
    
    test('should create a team', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);
        const user = await model.userModel.create({username: "test", email: "test@ups.com", name: "Tester", status: UserStatusType.active, role: RoleType.owner});

        const team = await instance.createTeam(user._id.toString(), "My Team");
        logger.info("team: ", JSON.stringify(team));
    });

    test('should find a team', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);
        const owner = await model.userModel.create({username: "owner", email: "owner@zbitech.net", name: "Resource Owner", status: UserStatusType.active, role: RoleType.owner});
        const user = await model.userModel.create({username: "user", email: "user@zbitech.net", name: "Resource User", status: UserStatusType.active, role: RoleType.user});

        const team = await model.teamModel.create({name: "My Team", owner: owner._id, members:[
            {user: user._id, role: RoleType.user}
        ]});

        const newTeam = await instance.findTeam(team._id.toString());
        logger.info("team: ", JSON.stringify(newTeam));
    });

    test('should find teams', async () => {
        expect(instance).toBeInstanceOf(UserMongoRepository);

        const owner1 = await model.userModel.create({username: "owner1", email: "owner1@zbitech.net", name: "Resource Owner1", status: UserStatusType.active, role: RoleType.owner});
        const user1 = await model.userModel.create({username: "user1", email: "user1@zbitech.net", name: "Resource User1", status: UserStatusType.active, role: RoleType.user});
        const team1 = await model.teamModel.create({name: "My Team 1", owner: owner1._id, members:[{user: user1._id, role: RoleType.user}]});

        const owner2 = await model.userModel.create({username: "owner2", email: "owner2@zbitech.net", name: "Resource Owner2", status: UserStatusType.active, role: RoleType.owner});
        const user2 = await model.userModel.create({username: "user2", email: "user2@zbitech.net", name: "Resource User2", status: UserStatusType.active, role: RoleType.user});
        const team2 = await model.teamModel.create({name: "My Team 2", owner: owner2._id, members:[{user: user2._id, role: RoleType.user}]});

        const teams = await instance.findTeams(10, 10);
        logger.info("teams: ", JSON.stringify(teams));
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
        logger.info("memberships: ", JSON.stringify(memberships));
    })
});
