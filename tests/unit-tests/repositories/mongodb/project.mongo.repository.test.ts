import { MongoMemoryDB } from "../../../../src/services/mongodb-mem.service";
import ProjectMongoRepository from "../../../../src/repositories/mongodb/project.mongo.repository";
import * as mongoHelper from "../../../../src/repositories/mongodb/helper";

import { getLogger } from "../../../../src/libs/logger";
import { Logger } from "winston";
import * as mock_data from "../../../mock/mock_data";
import * as db_helper from "../../../mock/db_helper";
import { ProjectRequest, Project, Instance, KubernetesResources, KubernetesResource } from "../../../../src/model/model";
import { NetworkType, NodeType, ResourceType, RoleType, StatusType } from "../../../../src/model/zbi.enum";
import { generateId } from "../../../mock/util";

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

        const owner = mongoHelper.createUser(await db_helper.createUserObject({}));
        const team = mongoHelper.createTeam(await db_helper.createTeamObject({owner: owner.userid}));
        logger.info("created owner: " + JSON.stringify(owner));
        logger.info("created team: " + JSON.stringify(team));

        const project: ProjectRequest = mock_data.createProjectRequest({owner: owner.userid, team: team.id});
        const newProject = await instance.createProject(project);
        logger.info("created schema: " + JSON.stringify(newProject));
    });

    test('should find projects', async () => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        const projects: any[] = await db_helper.createProjectObjects(10);

        const _projects = await instance.findProjects({}, 5, 1);
        logger.info(`found projects: ${JSON.stringify(_projects)}`);
    });

    test('should find project', async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        const owner: any = await db_helper.createUserObject({role: RoleType.owner});
        const team: any = await db_helper.createTeamObject({owner: owner._id});
        const project: any = await db_helper.createProjectObject({owner: owner._id, team: team._id});

        const proj = await instance.findProject(project._id);
        logger.info(`found project: ${JSON.stringify(proj)}`);
    });


    test('should create instance', async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        const owner: any = await db_helper.createUserObject({role: RoleType.owner});
        const team: any = await db_helper.createTeamObject({owner: owner._id});
        const project: any = await db_helper.createProjectObject({owner: owner._id, team: team._id});

        const node: Instance = mock_data.createInstance({});
        const inst = await instance.createInstance(project._id, node);

        logger.info(`create instance: ${JSON.stringify(inst)}`);
    });

    test('should find instance', async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        const {owner, team, project, instance: node} = await db_helper.createCompleteInstanceObject(NodeType.zcash, NetworkType.testnet);
        const inst = await instance.findInstance(node._id);

        logger.info(`found instance: ${JSON.stringify(inst)}`);
    });

    test('should not find instance', async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        await expect(instance.findInstance(generateId())).rejects.toThrow("item not found");
    });
 
    test('should update instance', async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        const {owner, team, project} = await db_helper.createCompleteProjectObject(NetworkType.testnet);
        const node:any = await db_helper.createInstanceObject({project: project._id, type: NodeType.zcash, description: "test instance"});

        const node1:Instance = mongoHelper.createInstance(node);
        node1.description = "updated description";
        const newNode = await instance.updateInstance(node1);
        expect(newNode.description).toBe(node1.description);
    });

    test(`should delete instance`, async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        const {owner, team, project, instance: node} = await db_helper.createCompleteInstanceObject(NodeType.zcash, NetworkType.testnet);
        logger.info(`created instance: ${JSON.stringify(node)}`);
        await expect(instance.deleteInstance(node._id.toString())).resolves.toBeUndefined();
    });

    test(`should fail to delete non-existent instance`, async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        const {owner, team, project, instance: node} = await db_helper.createCompleteInstanceObject(NodeType.zcash, NetworkType.testnet);
        logger.info(`created instance: ${JSON.stringify(node)}`);
        await expect(instance.deleteInstance(generateId())).rejects.toThrow(Error);
    });

    test(`should create kubernetes resources`, async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);

        const {owner, team, project, instance: node} = await db_helper.createCompleteInstanceObject(NodeType.zcash, NetworkType.testnet);
        const resources: KubernetesResources = mock_data.createKubernetesResources(3);        

        const newResources: KubernetesResources = await instance.createInstanceResources(node._id.toString(), resources);
        logger.info(`resources => ${JSON.stringify(newResources)}`);
    });

    test('should get kubernetes resources', async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);
        const {owner, team, project, instance: node} = await db_helper.createCompleteInstanceObjectWithResources(NodeType.zcash, NetworkType.testnet, 3);

        const resources: KubernetesResources = await instance.getInstanceResources(node._id.toString());
        logger.info(`received => ${JSON.stringify(resources)}`);
    });

    test('should get kubernetes resource', async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);
        const {owner, team, project, instance: node} = await db_helper.createCompleteInstanceObjectWithResources(NodeType.zcash, NetworkType.testnet, 1);

        logger.info(`instance resources => ${JSON.stringify(node)}`);

        const _deployment: any = node.resources.deployment;
        const deployment: KubernetesResource = await instance.getInstanceResource(node._id.toString(), ResourceType.deployment, _deployment.name);
        expect(deployment.name).toBe(_deployment.name);

        const _config: any = node.resources.configmap;
        const config: KubernetesResource = await instance.getInstanceResource(node._id.toString(), ResourceType.configmap, _config.name);
        expect(config.name).toBe(_config.name);

        const _snapshot: any = node.resources.volumesnapshot[0];
        const snapshot: KubernetesResource = await instance.getInstanceResource(node._id.toString(), ResourceType.volumesnapshot, _snapshot.name);
        expect(snapshot.name).toBe(_snapshot.name);

        const _schedule: any = node.resources.snapshotschedule;
        const schedule: KubernetesResource = await instance.getInstanceResource(node._id.toString(), ResourceType.snapshotschedule, _config.name);
        expect(schedule.name).toBe(_schedule.name);
    });

    test('should update kubernetes resource', async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);
        const {owner, team, project, instance: node} = await db_helper.createCompleteInstanceObjectWithResources(NodeType.zcash, NetworkType.testnet, 1);

        const _deployment: any = node.resources.deployment;

        const dep:KubernetesResource = mongoHelper.createKubernetesResource(_deployment);
        dep.status = StatusType.runnning;

        const deployment = await instance.updateInstanceResource(node._id.toString(), dep, new Date());
        expect(deployment.status).toBe(dep.status);
    });

    test('should delete kubernetes resource', async() => {
        expect(instance).toBeInstanceOf(ProjectMongoRepository);
        const {owner, team, project, instance: node} = await db_helper.createCompleteInstanceObjectWithResources(NodeType.zcash, NetworkType.testnet, 1);

    });
});
