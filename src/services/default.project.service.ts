import { ProjectService } from "src/interfaces";
import { Project, QueryParams, KubernetesResource, Instance, SnapshotScheduleRequest, KubernetesResources } from "src/model/model";
import IAMMongoRepository from "../repositories/mongodb/iam.mongo.repository";

export class DefaultProjectService implements ProjectService {

    async createProject(project: Project): Promise<Project> {
        throw new Error("Method not implemented.");
    }

    async findProjects(params: QueryParams): Promise<Project[]> {
        throw new Error("Method not implemented.");
    }

    async findProject(projectId: string): Promise<Project> {
        throw new Error("Method not implemented.");
    }

    async updateProject(projectId: string, project: Project): Promise<Project> {
        throw new Error("Method not implemented.");
    }

    async repairProject(projectId: string): Promise<Project> {
        throw new Error("Method not implemented.");
    }

    async deleteProject(projectId: string): Promise<Project> {
        throw new Error("Method not implemented.");
    }

    async purgeProject(projectId: string): Promise<Project> {
        throw new Error("Method not implemented.");
    }

    async updateProjectResource(): Promise<KubernetesResource> {
        throw new Error("Method not implemented.");
    }

    async createInstance(project: Project, instance: Instance): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async findAllInstances(): Promise<Instance[]> {
        throw new Error("Method not implemented.");
    }

    async findInstances(params: QueryParams): Promise<Instance[]> {
        throw new Error("Method not implemented.");
    }

    async findInstance(instanceId: string): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async updateInstance(instanceId: string, instance: Instance): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async repairInstance(instanceId: string): Promise<Instance> {
        throw new Error("Method not implemented.");
    }

    async startInstance(instanceId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async stopInstance(instanceId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createInstanceBackup(instanceId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createInstanceBackupSchedule(instanceId: string, request: SnapshotScheduleRequest): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async deleteInstance(instanceId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async purgeInstance(instanceId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getInstanceResources(instanceId: string): Promise<KubernetesResources> {
        throw new Error("Method not implemented.");
    }

    async getInstanceResource(instanceId: string): Promise<KubernetesResource> {
        throw new Error("Method not implemented.");
    }

    async updateInstanceResource(instanceId: string, resource: KubernetesResource): Promise<KubernetesResource> {
        throw new Error("Method not implemented.");
    }

    async deleteInstanceResource(instanceId: string, resourceId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}