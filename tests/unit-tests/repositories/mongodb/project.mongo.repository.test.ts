import { MongoMemoryDB } from "../../../../src/services/mongodb/mongodb-mem.service";
import ProjectMongoRepository from "../../../../src/repositories/mongodb/project.mongo.repository";
import model from "../../../../src/repositories/mongodb/mongo.model";
import { getLogger } from "../../../../src/logger";
import { Logger } from "winston";
import { createProject, createInstance } from "../../../mock/mock_data";
import { createUserObject, createTeamObject, createProjectObject, createProjectObjects } from "../../../mock/db_helper";
import { Project, User, Team, Instance } from "../../../../src/model/model";
import { RoleType } from "../../../../src/model/zbi.enum";

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

        const owner: any = await createUserObject({});
        const team: any = await createTeamObject({owner: owner._id});
        logger.info("created owner: " + JSON.stringify(owner));
        logger.info("created team: " + JSON.stringify(team));

        const project: Project = createProject({})
        const newProject = await instance.createProject(project.name, owner._id, team._id, project.network, project.status, project.description);
        logger.info("created schema: " + JSON.stringify(newProject));
    });

    test('should find projects', async () => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        const projects: any[] = await createProjectObjects(10);

        const _projects = await instance.findProjects({}, 5, 1);
        logger.info(`found projects: ${JSON.stringify(_projects)}`);
    });

    test('should find project', async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        const owner: any = await createUserObject({role: RoleType.owner});
        const team: any = await createTeamObject({owner: owner._id});
        const project: any = await createProjectObject({owner: owner._id, team: team._id});

        const proj = await instance.findProject(project._id);
        logger.info(`found project: ${JSON.stringify(proj)}`);
    });


    test('should create instance', async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        const owner: any = await createUserObject({role: RoleType.owner});
        const team: any = await createTeamObject({owner: owner._id});
        const project: any = await createProjectObject({owner: owner._id, team: team._id});

        const node: Instance = createInstance({});
        const inst = await instance.createInstance(project._id, node);

        logger.info(`create instance: ${JSON.stringify(inst)}`);
    });
});
