import { User, Team, TeamMember, Project, Instance, ResourceRequest, KubernetesResource, KubernetesResources } from "src/model/model";


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

export function createInstances(instances: any[]): Instance[] {
    return instances.map( instance => createInstance(instance));
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

export function createKubernetesResource(resource: any): KubernetesResource {
    return {
        id: resource._id,
        name: resource.name,
        type: resource.type,
        status: resource.status,
        properties: resource.properties
    }
}

export function createKubernetesResources(resources: any): KubernetesResources {
    return {
        configmap: createKubernetesResource(resources.configmap),
        secret: createKubernetesResource(resources.secret),
        persistentvolumeclaim: createKubernetesResource(resources.persistentvolumeclaim),
        deployment: createKubernetesResource(resources.deployment),
        service: createKubernetesResource(resources.service),
        httpproxy: createKubernetesResource(resources.httpproxy),
        volumesnapshot: resources.volumesnapshot.map((resource:any) => createKubernetesResource(resource)),
        snapshotschedule: createKubernetesResource(resources.snapshotschedule)
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