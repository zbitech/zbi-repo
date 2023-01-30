import DefaultProjectService from "../../../src/services/default.project.service";
import KubernetesControllerService from "../../../src/services/k8s.controller.service";
import ProjectMongoRepository from "../../../src/repositories/mongodb/project.mongo.repository";
import { getLogger } from "../../../src/logger";
import { Logger } from "winston";
import { ProjectRepository, ControllerService } from "../../../src/interfaces";
import { MongoMemoryDB } from "../../../src/services/mongodb/mongodb-mem.service";

let instance: DefaultProjectService;
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
        instance = new DefaultProjectService(new ProjectMongoRepository(), new KubernetesControllerService());
    });

    afterEach(async () => {
        await db.clear();
    });

    test('', async () => {
        expect(instance).toBeInstanceOf(DefaultProjectService);

    });
});