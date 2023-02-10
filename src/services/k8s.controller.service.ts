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
        throw new Error("Method not implemented.");
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
            const response = await axios.post(`${ControllerURL}/projects/${project.id}`, JSON.stringify(project), {headers: HEADERS});
            if( response.status === HttpStatusCode.Created ) {
                return JSON.parse(response.data);
            } else {
                throw new Error(response.statusText);
            }
        } catch (err) {
            throw err
        }    
    }

    async deleteProject(Project: Project): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getInstance(projectName: string, instanceName: string): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async createInstance(project: Project, instance: Instance): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async repairInstance(project: Project, instance: Instance): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async stopInstance(projectName: string, instanceName: string): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async startInstance(projectName: string, instanceName: string): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async createInstanceBackup(projectName: string, instanceName: string): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async createInstanceBackupSchedule(projectName: string, instanceName: string, schedule: SnapshotScheduleRequest): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async getInstanceResources(projectName: string, instanceName: string): Promise<KubernetesResources> {
        throw new Error("Method not implemented.");
    }

    async getInstanceResource(projectName: string, instanceName: string, resourceType: ResourceType, resourceName: string): Promise<KubernetesResource> {
        throw new Error("Method not implemented.");
    }

    async deleteInstanceResource(projectName: string, instanceName: string, resourceType: ResourceType, resourceName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}