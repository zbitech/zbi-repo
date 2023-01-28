import { User, Project, Team, TeamMember, Instance, ResourceRequest } from "../../src/model/model";
import { NetworkType, RoleType, StatusType, InviteStatusType, UserStatusType, NodeType, VolumeType, VolumeSourceType, ResourceType } from "../../src/model/zbi.enum";
import { getRandom, generateString, generateId, generateName, generateEmail, generatePhrase } from "./util";
import model from "../../src/repositories/mongodb/mongo.model";
import mongoose from 'mongoose';
import { getLogger } from "../../src/logger";
import { stringify } from "querystring";


const logger = getLogger('mock-data');

const USER_ROLES: RoleType[] = [RoleType.owner, RoleType.user];
const INST_TYPES: NodeType[]= [NodeType.zcash, NodeType.lwd];
const INST_STATUS: StatusType[] = [StatusType.runnning, StatusType.stopped, StatusType.new, StatusType.pending, StatusType.failed];

export function createUser(user: any): User {
    return {
        userId: user.userId ? user.userId : generateId(),
        userName: user.userName ? user.userName : generateString(5),
        email: user.email ? user.email : generateEmail(),
        name: user.name ? user.name : generateName(),
        role: user.role ? user.role : getRandom(USER_ROLES),
        status: user.status ? user.status : UserStatusType.active
    }
}

export function createTeam(team: any, ...members: any): Team {
    return {
        id: team.id ? team.id : generateId(),
        name: team.name ? team.name : generateString(5),
        owner: team.owner ? team.owner : createUser({role: RoleType.owner}),
        members: members
    }
}

export function createTeamMember(member: any): TeamMember {
    return {
        user: member.user ,
        role: member.role ? member.role : RoleType.user,
        status: member.status ? member.status : InviteStatusType.pending
    }
}

export function createUserSchema(user: any): any {
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

export function createTeamSchema(team: any, ...members: any): any {
    return {
        id: team.id ? team.id : generateId(),
        name: team.name ? team.name : generateString(5),
        owner: team.owner ? team.owner : createUser({role: RoleType.owner}),
        members: members,
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

export function createProject(project: any): Project {

    return {
        id: project.id ? project.id : generateId(),
        name: project.name ? project.name : generateString(7),
        owner: project.owner ? project.owner : createUser({role: RoleType.owner}),
        team: project.team ? project.team : createTeam({}),
        network: project.network ? project.network : NetworkType.testnet,
        status: project.status ? project.status : StatusType.new,
        description: project.description ? project.description : generateString(20)
    }
}

export function createInstance(instance: any): Instance {

    const itype = instance.type ? instance.type : getRandom(INST_TYPES);

    return {
        id: instance.id ? instance.id : generateId(),
        name: instance.name ? instance.name : generateString(7),
        type: itype,
        description: instance.description ? instance.description : generatePhrase(5),
        status: instance.status ? instance.status : getRandom(INST_STATUS),
        request: createResourceRequest(instance.request)
    }
}

export function createResourceRequest(request: any): ResourceRequest {
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

export function createKubernetesSnapshotResources(length: number): any {
    var resources: any[] = [];
    for (let index = 0; index < length; index++) {
        resources.push({name: `snapshot-${index+1}`, type: ResourceType.volumesnapshot, status: StatusType.runnning, properties: {}});
    }
    return resources;
}

export function createKubernetesResources(snapshots: number): any {
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