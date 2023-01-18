import { MongoMemoryDB } from "../../../../src/services/mongodb/mongodb-mem.service";
import IAMMongoRepository from "../../../../src/repositories/mongodb/iam.mongo.repository";
import { UserSchema, TeamSchema } from "../../../../src/repositories/mongodb/schema.mongo";
import { User } from "../../../../src/model/model";
import { RoleType, UserStatusType } from "../../../../src/model/zbi.enum";

let instance: IAMMongoRepository;
let db: MongoMemoryDB = new MongoMemoryDB();

beforeAll(async () => {
    await db.init();
    await db.connect();
});

afterAll(async () => {
    await db.close();
});

describe('IAMMongoRepository', () => {
    
    beforeEach(async () => {
        instance = new IAMMongoRepository();
    });

    afterEach(async () => {
        await db.clear();
    })

    test('should create a user', async () => {
        expect(instance).toBeInstanceOf(IAMMongoRepository);
        const user: User = {userName: "user1", email: "user1@zbitech.net", name: "User One", role: RoleType.owner};

        const newUser = await instance.createUser(user);
        console.log("created: ", JSON.stringify(newUser));
    });
    
    test('should create a team', async () => {
        expect(instance).toBeInstanceOf(IAMMongoRepository);
        const user = await UserSchema.create({userName: "test", email: "test@ups.com", name: "Tester", status: UserStatusType.active, role: RoleType.owner});

        const team = await instance.createTeam(user._id.toString(), "My Team");
        console.log("team: ", JSON.stringify(team));
    });

    test('should find a team', async () => {
        expect(instance).toBeInstanceOf(IAMMongoRepository);
        const owner = await UserSchema.create({userName: "owner", email: "owner@zbitech.net", name: "Resource Owner", status: UserStatusType.active, role: RoleType.owner});
        const user = await UserSchema.create({userName: "user", email: "user@zbitech.net", name: "Resource User", status: UserStatusType.active, role: RoleType.user});

        const team = await TeamSchema.create({name: "My Team", owner: owner._id, members:[
            {user: user._id, role: RoleType.user}
        ]})

        const newTeam = await instance.findTeam(team._id.toString());
        console.log("team: ", JSON.stringify(newTeam));
    });

});