import DefaultProjectService from "../../../src/services/default.project.service";
import KubernetesControllerService from "../../../src/services/k8s.controller.service";
import ProjectMongoRepository from "../../../src/repositories/mongodb/project.mongo.repository";
import { getLogger } from "../../../src/libs/logger";
import { Logger } from "winston";
import { ProjectRepository, ControllerService } from "../../../src/interfaces";
import { MongoMemoryDB } from "../../../src/services/mongodb-mem.service";
import projectService from "../../../src/services/default.project.service";

let instance: any;
let logger: Logger;
let db: MongoMemoryDB = new MongoMemoryDB();

beforeAll(async () => {
    logger = getLogger("test-proj-svc");

    await db.init();
    await db.connect();
});

afterAll(async () => {
    await db.close();
});

describe('DefaultProjectService', () => {
    
    beforeEach(async () => {
        instance = projectService;
    });

    afterEach(async () => {
        await db.clear();
    });

    test('should create project', async() => {

    });

});