import { Project, Instance, SnapshotScheduleRequest, KubernetesResources, KubernetesResource } from "../model/model";
import { ResourceType } from "../model/zbi.enum";
import { ControllerService } from "..//interfaces";
import axios, { AxiosResponse, HttpStatusCode } from "axios";
import { getLogger } from "../libs/logger";
import { BadRequestError, ServiceError, ServiceType } from "../libs/errors";

const ControllerURL = process.env.ZBI_CONTROLLER_URL || "http://localhost:8180";
const HEADERS = {"Content-Type": "text/json"};

class KubernetesControllerService implements ControllerService {

    async getStatus(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getProject(projectName: string): Promise<Project> {
        const logger = getLogger("k8s-get-project");
        try {            
            const response = await axios.get(`${ControllerURL}/projects/${projectName}`, {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                logger.debug(`response = ${JSON.stringify(response.data)}`);
                //return JSON.parse(response.data);
                return response.data.project;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }
    }

    async createProject(project: Project): Promise<Project> {
        const logger = getLogger("k8s-create-project");
        try {            
            const data = {project: createProject(project)};
            const response = await axios.post(`${ControllerURL}/projects`, JSON.stringify(data), {headers: HEADERS});
            if( response.status === HttpStatusCode.Created ) {
                return response.data.project;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }
    }

    async repairProject(project: Project): Promise<Project> {
        const logger = getLogger("k8s-repair-project");
        try {            
            const response = await axios.patch(`${ControllerURL}/projects/${project.name}`, JSON.stringify(project), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return response.data.project;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }    
    }

    async deleteProject(project: Project): Promise<void> {
        const logger = getLogger("k8s-delete-project");
        try {            
            const response = await axios.delete(`${ControllerURL}/projects/${project.id}`, {
                headers: HEADERS,
                data: JSON.stringify(project)
            });

            if( response.status === HttpStatusCode.Created ) {
                return response.data.project;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }    
    }

    async getInstance(projectName: string, instanceName: string): Promise<Instance> {
        const logger = getLogger("k8s-get-instance");
        try {            
            const response = await axios.get(`${ControllerURL}/projects/${projectName}/instances/${instanceName}`, {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return response.data.instance;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }

    }

    async createInstance(project: Project, instance: Instance): Promise<void> {
        const logger = getLogger("k8s-create-instance");
        try { 

            const data = {project: createProject(project), instance: createInstance(instance)};
            const response = await axios.post(`${ControllerURL}/projects/${project.name}/instances`, JSON.stringify(data), {headers: HEADERS});
            if( response.status === HttpStatusCode.Created ) {
                return response.data.instance;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }
    }

    async updateInstance(project: Project, instance: Instance): Promise<void> {
        const logger = getLogger("k8s-update-instance");
        try { 

            const data = {project: createProject(project), instance: createInstance(instance)};
            const response = await axios.put(`${ControllerURL}/projects/${project.name}/instances/${instance.name}`, JSON.stringify(data), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return response.data.instance;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }
    }    

    async repairInstance(project: Project, instance: Instance): Promise<Instance> {
        const logger = getLogger("k8s-repair-instance");
        try {            
            const data = {project: createProject(project), instance: createInstance(instance)};
            const response = await axios.patch(`${ControllerURL}/projects/${project.name}/instances/${instance.name}`, 
                JSON.stringify(data), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return response.data.instance;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }
    }

    async stopInstance(project: Project, instance: Instance): Promise<Instance> {
        const logger = getLogger("k8s-stop-instance");
        try {            
            const data = {project: createProject(project), instance: createInstance(instance)};
            const url = `${ControllerURL}/projects/${project.name}/instances/${instance.name}/stop`;
            logger.info(`calling ${url} with ${JSON.stringify(data)}`);
            const response = await axios.put(url, JSON.stringify(data), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                logger.info(`success response - ${JSON.stringify(response.data)}`);
                return response.data.instance;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw new BadRequestError(response.statusText);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }
    }

    async startInstance(project: Project, instance: Instance): Promise<Instance> {
        const logger = getLogger("k8s-start-instance");
        try {            
            const data = {project: createProject(project), instance: createInstance(instance)};
            const url = `${ControllerURL}/projects/${project.name}/instances/${instance.name}/start`;

            logger.info(`calling ${url} with ${JSON.stringify(data)}`);

            const response = await axios.put(url, JSON.stringify(data), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                logger.info(`success response - ${JSON.stringify(response.data)}`);
                return response.data.instance;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }
    }

    async rotateInstanceCredentials(project: Project, instance: Instance): Promise<Instance> {
        const logger = getLogger("k8s-rotate-instance");
        try {            
            const data = {project: createProject(project), instance: createInstance(instance)};
            const response = await axios.put(`${ControllerURL}/projects/${project.name}/instances/${instance.name}/rotate`, 
                JSON.stringify(data), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return response.data.instance;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }
    }

    async createInstanceSnapshot(project: Project, instance: Instance): Promise<Instance> {
        const logger = getLogger("k8s-create-instance-snapshot");
        try {            
            const data = {project: createProject(project), instance: createInstance(instance)};
            const response = await axios.put(`${ControllerURL}/projects/${project.name}/instances/${instance.name}/snapshot`, 
                JSON.stringify(data), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return response.data.instance;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }
    }

    async createInstanceSnapshotSchedule(project: Project, instance: Instance, schedule: SnapshotScheduleRequest): Promise<Instance> {
        const logger = getLogger("k8s-create-instance-schedule");
        try {            
            const data = {project: createProject(project), instance: createInstance(instance), schedule};
            const response = await axios.put(`${ControllerURL}/projects/${project.name}/instances/${instance.name}/schedule`, 
                JSON.stringify(data), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return response.data.instance;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }
    }

    async deleteInstance(projectName: string, instanceName: string): Promise<void> {
        const logger = getLogger("k8s-delete-instance");
        try {            
            const response = await axios.delete(`${ControllerURL}/projects/${projectName}/instances/${instanceName}`, {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return response.data.instance;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            logger.error(err);
            throw new ServiceError(ServiceType.controller, err.message);
        }
    }

    async getInstanceResources(projectName: string, instanceName: string): Promise<KubernetesResources> {
        const logger = getLogger("k8s-get-instance-resources");
        try {            
            const response = await axios.get(`${ControllerURL}/projects/${projectName}/instances/${instanceName}/resources`, {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return JSON.parse(response.data);
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            throw err
        }
    }

    async getInstanceResource(projectName: string, instanceName: string, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource> {
        const logger = getLogger("k8s-get-instance-resource");
        try {            
            const response = await axios.get(`${ControllerURL}/projects/${projectName}/instances/${instanceName}/resources//${resourceName}/${resourceType}`, 
                        {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return JSON.parse(response.data);
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            throw err
        }

    }

    async deleteInstanceResource(projectName: string, instanceName: string, resourceType: ResourceType, resourceName: string): Promise<void> {
        const logger = getLogger("k8s-get-instance-resource");
        try {            
            const response = await axios.delete(`${ControllerURL}/projects/${projectName}/instances/${instanceName}/resources//${resourceName}/${resourceType}`, 
                        {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return;
            } else {
                logger.info(`error response = ${response.status} - ${response.statusText}`)
                throw handleErrorResponse(response);
            }
        } catch (err:any) {
            throw err
        }
    }
}

function createProject(project: Project) {
    return {
        id: project.id,
        name: project.name,
        owner: project.owner.userid,
        team: project.team.id,
        network: project.network
    }
}

function createInstance(instance: Instance) {
    return {
        id: instance.id,
        name: instance.name,
        instanceType: instance.type,
        project: instance.project,
        request: {
            volumeType: instance.request.volume?.type,         
            volumeSize: instance.request.volume?.size,
            volumeSourceType: instance.request.volume?.source,
            volumeSourceName: instance.request.volume?.instance,
            volumeSourceProject: instance.request.volume?.project, 
            cpu: instance.request.cpu,
            memory: instance.request.memory,
            peers: instance.request.peers
        }
    } 
}

function handleErrorResponse(response: AxiosResponse): Error {

    if(response.status === HttpStatusCode.BadRequest ||
        response.status === HttpStatusCode.NotFound ||
        response.status === HttpStatusCode.UnprocessableEntity ) {
            return new BadRequestError(response.statusText);
    }

    return new ServiceError(ServiceType.controller, response.statusText);
}

export default new KubernetesControllerService();