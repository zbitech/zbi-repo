import { MongoMemoryDB } from "../../../../src/services/mongodb/mongodb-mem.service";
import ProjectMongoRepository from "../../../../src/repositories/mongodb/project.mongo.repository";
import model from "../../../../src/repositories/mongodb/mongo.model";
import { getLogger } from "../../../../src/logger";
import { Logger } from "winston";
import { createProjectSchema, createProject } from "../../../mock/mock_data";
import { createUserObject, createTeamObject } from "../../../mock/db_helper";
import { Project, User, Team } from "../../../../src/model/model";

let instance: ProjectMongoRepository;
let db: MongoMemoryDB = new MongoMemoryDB();
let logger: Logger;

beforeAll(async () => {
    logger = getLogger("test-proj-repo");
    await db.init();
    await db.connect();
});

afterAll(async () => {
    await db.close();
});

describe('ProjectMongoRepository', () => {
    
    beforeEach(async () => {
        instance = new ProjectMongoRepository();
    });

    afterEach(async () => {
        await db.clear();
    })
    
    test('should create a project', async () => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        const owner: any = createUserObject({});
        const team: any = createTeamObject({owner: owner._id});
        logger.info("created owner: " + JSON.stringify(owner));
        logger.info("created team: " + JSON.stringify(team));

        const project: Project = createProject({})
        const newProject = await instance.createProject(project.name, owner._id, team._id, project.network, project.status, project.description);
        logger.info("created schema: " + JSON.stringify(newProject));
    });

});