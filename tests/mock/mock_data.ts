import { User, Project, Team, TeamMember } from "../../src/model/model";
import { NetworkType, RoleType, StatusType, InviteStatusType, UserStatusType } from "../../src/model/zbi.enum";
import { getRandom, generateString, generateId, generateName, generateEmail } from "./util";
import model from "../../src/repositories/mongodb/mongo.model";
import mongoose from 'mongoose';
import { getLogger } from "../../src/logger";


const logger = getLogger('mock-data');

const USER_ROLES: RoleType[] = [RoleType.owner, RoleType.user];

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

export function createProjectSchema(project: any): any {
    return model.projectModel({
        _id: project.id ? project.id : generateId(),
        name: project.name ? project.name : generateString(7),
        network: project.network ? project.network : NetworkType.testnet ,
        status: project.status ? project.status : StatusType.new,
        owner: new mongoose.Types.ObjectId(project.owner.userId),
        team: new mongoose.Types.ObjectId(project.team.id),
        description: project.description ? project.description : generateString(20),
        created: project.created,
        updated: project.updated
    });
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