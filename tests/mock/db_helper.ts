import { User, Project, Team, TeamMember } from "../../src/model/model";
import { NetworkType, RoleType, StatusType, InviteStatusType, UserStatusType, VolumeType, VolumeSourceType, NodeType, ResourceType } from "../../src/model/zbi.enum";
import { getRandom, generateString, generateId, generateName, generateEmail } from "./util";
import model from "../../src/repositories/mongodb/mongo.model";
import mongoose from 'mongoose';
import { getLogger } from "../../src/logger";


const logger = getLogger('mock-schema');

const USER_ROLES: RoleType[] = [RoleType.owner, RoleType.user];

function createUserSchema(user: any): any {
    return {
        userId: user.userId ? user.userId : generateId(),
        userName: user.userName ? user.userName : generateString(5),
        email: user.email ? user.email : generateEmail(),
        name: user.name ? user.name : generateName(),
        role: user.role ? user.role : getRandom(USER_ROLES),
        status: user.status ? user.status : UserStatusType.active,
        created: user.created,
        updated: user.updated
    }
}

function createTeamSchema(team: any): any {
    return {
        id: team.id ? team.id : generateId(),
        name: team.name ? team.name : generateString(5),
        owner: team.owner,
        members: team.members,
        created: team.created,
        updated: team.updated
    }   
}

export function createTeamMemberSchema(member: any): any {
    return {
        user: new mongoose.Types.ObjectId(member.user.userId),
        role: member.role ? member.role : RoleType.user,
        status: member.status ? member.status : InviteStatusType.pending,
        created: member.created,
        updated: member.updated
    }
}

export function createProjectSchema(project: any): any {
    return model.projectModel({
        _id: project.id ? project.id : generateId(),
        name: project.name ? project.name : generateString(7),
        network: project.network ? project.network : NetworkType.testnet ,
        status: project.status ? project.status : StatusType.new,
        owner: project.owner,
        team: project.team,
        description: project.description ? project.description : generateString(20),
        created: project.created,
        updated: project.updated
    });
}

export function createKubernetesSnapshotResources(length: number): any {
    var resources: any[] = [];
    for (let index = 0; index < length; index++) {
        resources.push({name: `volumesnapshot-${index+1}`, type: ResourceType.volumesnapshot, status: StatusType.new, properties: {}});
    }
    return resources;
}

export function createKubernetesResourcesSchema(snapshots: number): any {
    return {
        configmap: {name: "configmap", type: ResourceType.configmap, status: StatusType.new, properties: {}},
        secret: {name: "secret", type: ResourceType.secret, status: StatusType.new, properties: {}},
        persistentvolumeclaim: {name: "persistentvolumeclaim", type: ResourceType.persistentvolumeclaim, status: StatusType.new, properties: {}},
        deployment: {name: "deployment", type: ResourceType.deployment, status: StatusType.new, properties: {}},
        service: {name: "service", type: ResourceType.service, status: StatusType.new, properties: {}},
        httpproxy: {name: "httpproxy", type: ResourceType.httpproxy, status: StatusType.new, properties: {}},
        volumesnapshot: createKubernetesSnapshotResources(snapshots),
        snapshotschedule: {name: "schedule", type: ResourceType.snapshotschedule, status: StatusType.new, properties: {}}
    };
}

export function createResourceRequestSchema(request: any): any {
    return {
        volumeType: request?.volumeType ? request.volumeType : VolumeType.persistentvolumeclaim,
        volumeSize: request?.volumeSize ? request.volumeSize : "1Gi",
        volumeSourceType: request?.volumeSourceType ? request.volumeSourceType : VolumeSourceType.new,
        volumeSource: request?.volumeSource,
        volumeSourceProject: request?.volumeSourceProject,
        cpu: request?.cpu ? request.cpu : "0.5",
        memory: request?.memory ? request.memory : "0.5",
        peers: request?.peers ? request.peers : [],
        properties: request?.properties ? request.properties : new Map<string, string>()
    }
}

export function createInstanceSchema(instance: any): any {
    return model.instanceModel({
        id: instance.id,
        name: instance.name ? instance.name : generateString(7),
        project: instance.project,
        type: instance.type,
        description: instance.description,
        status: instance.status,
        request: createResourceRequestSchema(instance.request)
    });
}

export function createInstanceSchemaWithResources(instance: any, snapshots: number): any {
    return model.instanceModel({
        id: instance.id,
        name: instance.name ? instance.name : generateString(7),
        project: instance.project,
        type: instance.type,
        description: instance.description,
        status: instance.status,
        request: createResourceRequestSchema(instance.request),
        resources: createKubernetesResourcesSchema(snapshots)
    });
}

export async function createUserObject(user: any) {
    const schema = createUserSchema(user);
    return await model.userModel.create(schema);
}

export async function createTeamObject(team: any) {
    return await model.teamModel.create(createTeamSchema(team));
}

export async function createProjectObject(project: any) {    
    return await model.projectModel.create(createProjectSchema(project));
}

export async function createInstanceObject(instance: any) {
    return await model.instanceModel.create(createInstanceSchema(instance));
}

export async function createInstanceObjectWithResources(instance: any, snapshots: number) {
    return await model.instanceModel.create(createInstanceSchemaWithResources(instance, snapshots));
}

export async function createCompleteProjectObject(network: NetworkType) {

    const owner: any = await createUserObject({role: RoleType.owner});
    const team: any = await createTeamObject({owner: owner._id});
    const project: any = await createProjectObject({network, owner: owner._id, team: team._id});

    return {owner, team, project};
}

export async function createCompleteInstanceObject(itype: NodeType, network: NetworkType) {
    const {owner, team, project}: any = await createCompleteProjectObject(network);

    const instance: any = await createInstanceObject({type: itype, project: project._id});
    return {owner, team, project, instance};
}

export async function createCompleteInstanceObjectWithResources(itype: NodeType, network: NetworkType, snapshots: number) {
    const {owner, team, project}: any = await createCompleteProjectObject(network);

    const instance: any = await createInstanceObjectWithResources({type: itype, project: project._id}, snapshots);
    return {owner, team, project, instance};
}

export async function createProjectObjects(length: number) {
    logger.info(`creating ${length} projects`);
    var projects:any[] = [];
    for (let index = 0; index < length; index++) {
        const owner: any = await createUserObject({role: RoleType.owner});
        const team: any = await createTeamObject({owner: owner._id});

        const project: any = await createProjectObject({owner: owner._id, team: team._id});
        projects.push(project);
   } 

   return projects;
}