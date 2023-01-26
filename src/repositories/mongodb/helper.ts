import { User, Team, TeamMember, Project, Instance, ResourceRequest } from "src/model/model";


export function createUser(uc: any): User {
    if(uc) {
        return {
            userId: uc._id,
            userName: uc.userName, name: uc.name, email: uc.email, 
            status: uc.status, role: uc.role
        }
    }

    return uc;
}

export function createUsers(uc: Array<any>): User[] {
    return uc.map( user => createUser(user));
}

export function createTeam(tc: any): Team {
    return {
        id: tc._id,
        name: tc.name,
        owner: createUser(tc.owner),
        members: tc.members ? tc.members.map((mbr:any) => createTeamMember(mbr)) : undefined
    }
}

export function createTeamMember(tmc: any): TeamMember {
    return {
        user: tmc.user, role: tmc.role, status: tmc.status
    }
}

export function createTeams(tc: Array<any>): Team[] {
    return tc.map( team => createTeam(team) );
}

export function createInstance(instance: any): Instance {
    return {
        id: instance._id,
        name: instance.name,
        type: instance.type,
        description: instance.description,
        status: instance.status,
        request: createResourceRequest(instance.request)
    }
}

export function createResourceRequest(request: any): ResourceRequest {
    return {
        volumeType: request.volumeType,
        volumeSize: request.volumeSize,
        volumeSourceType: request.volumeSourceType,
        volumeSource: request.volumeSource,
        volumeSourceProject: request.volumeSourceProject,
        cpu: request.cpu,
        memory: request.memory,
        peers: request.peers,
        properties: request.properties,
    }
}

export function createProject(project: any): Project {
    return {
        id: project._id,
        name: project.name,
        owner: createUser(project.owner),
        team: createTeam(project.team),
        network: project.network,
        status: project.status,
        description: project.description 
    }
}

export function createProjects(projects: any[]): Project[] {
    return projects.map( project => createProject(project));
}