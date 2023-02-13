import { Project, Instance, SnapshotScheduleRequest, KubernetesResources, KubernetesResource } from "src/model/model";
import { ResourceType } from "src/model/zbi.enum";
import { ControllerService } from "..//interfaces";
import axios, { HttpStatusCode } from "axios";

const ControllerURL = process.env.ZBI_CONTROLLER_URL || "http://localhost:8180";
const HEADERS = {"Content-Type": "text/json"};

export default class KubernetesControllerService implements ControllerService {

    async getStatus(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getProject(projectName: string): Promise<Project> {
        try {            
            const response = await axios.post(`${ControllerURL}/projects`, projectName, {headers: HEADERS});
            if( response.status === HttpStatusCode.Created ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }
    }

    async createProject(project: Project): Promise<Project> {
        try {            
            const response = await axios.post(`${ControllerURL}/projects`, JSON.stringify(project), {headers: HEADERS});
            if( response.status === HttpStatusCode.Created ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }
    }

    async repairProject(project: Project): Promise<Project> {
        try {            
            const response = await axios.patch(`${ControllerURL}/projects/${project.id}`, JSON.stringify(project), {headers: HEADERS});
            if( response.status === HttpStatusCode.Created ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }    
    }

    async deleteProject(project: Project): Promise<void> {
        try {            
            const response = await axios.delete(`${ControllerURL}/projects/${project.id}`, {
                headers: HEADERS,
                data: JSON.stringify(project)
            });
            if( response.status === HttpStatusCode.Created ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }    
    }

    async getInstance(projectName: string, instanceName: string): Promise<Instance> {
        try {            
            const response = await axios.get(`${ControllerURL}/projects/${projectName}/instances/${instanceName}`, {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }

    }

    async createInstance(project: Project, instance: Instance): Promise<void> {
        try {            
            const response = await axios.post(`${ControllerURL}/projects/${project.name}/instances`, JSON.stringify({project, instance}), {headers: HEADERS});
            if( response.status === HttpStatusCode.Created ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }
    }

    async repairInstance(project: Project, instance: Instance): Promise<Instance> {
        try {            
            const response = await axios.patch(`${ControllerURL}/projects/${project.name}/instances/${instance.name}`, 
                JSON.stringify({project, instance}), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }
    }

    async stopInstance(project: Project, instance: Instance): Promise<Instance> {
        try {            
            const response = await axios.put(`${ControllerURL}/projects/${project.name}/instances/${instance.name}/stop`, 
                JSON.stringify({project, instance}), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }
    }

    async startInstance(project: Project, instance: Instance): Promise<Instance> {
        try {            
            const response = await axios.put(`${ControllerURL}/projects/${project.name}/instances/${instance.name}/start`, 
                JSON.stringify({project, instance}), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }
    }

    async rotateInstanceCredentials(project: Project, instance: Instance): Promise<Instance> {
        try {            
            const response = await axios.put(`${ControllerURL}/projects/${project.name}/instances/${instance.name}/rotate`, 
                JSON.stringify({project, instance}), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }
    }

    async createInstanceBackup(project: Project, instance: Instance): Promise<Instance> {
        try {            
            const response = await axios.put(`${ControllerURL}/projects/${project.name}/instances/${instance.name}/snapshot`, 
                JSON.stringify({project, instance}), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }
    }

    async createInstanceBackupSchedule(project: Project, instance: Instance, schedule: SnapshotScheduleRequest): Promise<Instance> {
        try {            
            const response = await axios.put(`${ControllerURL}/projects/${project.name}/instances/${instance.name}/schedule`, 
                JSON.stringify({project, instance, schedule}), {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }

    }

    async deleteInstance(projectName: string, instanceName: string): Promise<void> {
        try {            
            const response = await axios.delete(`${ControllerURL}/projects/${projectName}/instances/${instanceName}`, {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }
    }

    async getInstanceResources(projectName: string, instanceName: string): Promise<KubernetesResources> {
        try {            
            const response = await axios.get(`${ControllerURL}/projects/${projectName}/instances/${instanceName}/resources`, {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }
    }

    async getInstanceResource(projectName: string, instanceName: string, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource> {
        try {            
            const response = await axios.get(`${ControllerURL}/projects/${projectName}/instances/${instanceName}/resources//${resourceName}/${resourceType}`, 
                        {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }

    }

    async deleteInstanceResource(projectName: string, instanceName: string, resourceType: ResourceType, resourceName: string): Promise<void> {
        try {            
            const response = await axios.delete(`${ControllerURL}/projects/${projectName}/instances/${instanceName}/resources//${resourceName}/${resourceType}`, 
                        {headers: HEADERS});
            if( response.status === HttpStatusCode.Ok ) {
 
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }
    }
}