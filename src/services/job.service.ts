import { getLogger } from "../libs/logger";
import { IJobService } from "../interfaces";
import * as queues from "../libs/queues";
import beanFactory from "../factory/bean.factory";
import { Instance, Job, Project, SnapshotScheduleRequest } from "../model/model";

class JobService implements IJobService {
    deleteInstanceSnapshot(project: Project, instance: Instance, snapshot: string): Promise<Job> {
        throw new Error("Method not implemented.");
    }
    createInstanceSchedule(project: Project, instance: Instance, scheduleRequest: SnapshotScheduleRequest): Promise<Job> {
        throw new Error("Method not implemented.");
    }
    deleteInstanceSchedule(project: Project, instance: Instance, schedule: string): Promise<Job> {
        throw new Error("Method not implemented.");
    }
    getProjectJobs(projectid: string): Promise<Job[]> {
        throw new Error("Method not implemented.");
    }
    getProjectJob(projectid: string, jobid: string): Promise<Job> {
        throw new Error("Method not implemented.");
    }
    cancelProjectJob(projectid: string, jobid: string): Promise<Job> {
        throw new Error("Method not implemented.");
    }
    getInstanceJobs(instanceid: string): Promise<Job[]> {
        throw new Error("Method not implemented.");
    }
    getInstanceJob(instanceid: string, jobid: string): Promise<Job> {
        throw new Error("Method not implemented.");
    }
    cancelInstanceJob(instanceid: string, jobid: string): Promise<Job> {
        throw new Error("Method not implemented.");
    }

    async createProject(project: Project): Promise<Job> {
        const logger = getLogger('create-project-job');
        try {

            const job = await queues.createProject(project);

            const projRepo = beanFactory.getProjectRepository();
            await projRepo.addProjectJob(project.id as string, job.id as string);

            return await createJob(job);

        } catch (err: any) {
            throw err;            
        }
    }
    
    async repairProject(project: Project): Promise<Job> {
        const logger = getLogger('repair-project-job');
        try {
            const job = await queues.repairProject(project);

            const projRepo = beanFactory.getProjectRepository();
            await projRepo.addProjectJob(project.id as string, job.id as string);

            return await createJob(job);
        } catch (err: any) {
            throw err;            
        }
    }
    
    async deleteProject(project: Project): Promise<Job> {
        const logger = getLogger('delete-project-job');
        try {

            const job = await queues.deleteProject(project);

            const projRepo = beanFactory.getProjectRepository();
            await projRepo.addProjectJob(project.id as string, job.id as string);

            return await createJob(job);
        } catch (err: any) {
            throw err;            
        }
    }

    async createInstance(project: Project, instance: Instance): Promise<Job> {
        const logger = getLogger('create-instance-job');
        try {

            const job = await queues.createInstance(project, instance);

            const projRepo = beanFactory.getProjectRepository();
            await projRepo.addInstanceJob(instance.id as string, job.id as string);

            return await createJob(job);
        } catch (err: any) {
            throw err;            
        }
    }

    async updateInstance(project: Project, instance: Instance): Promise<Job> {
        const logger = getLogger('update-instance-job');
        try {

            const job = await queues.updateInstance(project, instance);

            const projRepo = beanFactory.getProjectRepository();
            await projRepo.addInstanceJob(instance.id as string, job.id as string);

            return await createJob(job);
        } catch (err: any) {
            throw err;            
        }

    }

    async repairInstance(project: Project, instance: Instance): Promise<Job> {
        const logger = getLogger('repair-instance-job');
        try {

            const job = await queues.repairInstance(project, instance);

            const projRepo = beanFactory.getProjectRepository();
            await projRepo.addInstanceJob(instance.id as string, job.id as string);

            return await createJob(job);
        } catch (err: any) {
            throw err;            
        }

    }

    async deleteInstance(project: Project, instance: Instance): Promise<Job> {
        const logger = getLogger('delete-instance-job');
        try {

            const job = await queues.deleteInstance(project, instance);

            const projRepo = beanFactory.getProjectRepository();
            await projRepo.addInstanceJob(instance.id as string, job.id as string);

            return await createJob(job);
        } catch (err: any) {
            throw err;            
        }

    }

    async startInstance(project: Project, instance: Instance): Promise<Job> {
        const logger = getLogger('start-instance-job');
        try {

            const job = await queues.startInstance(project, instance);

            const projRepo = beanFactory.getProjectRepository();
            await projRepo.addInstanceJob(instance.id as string, job.id as string);

            return await createJob(job);
        } catch (err: any) {
            throw err;            
        }
    }

    async stopInstance(project: Project, instance: Instance): Promise<Job> {
        const logger = getLogger('stop-instance-job');
        try {

            const job = await queues.stopInstance(project, instance);
 
            const projRepo = beanFactory.getProjectRepository();
            await projRepo.addInstanceJob(instance.id as string, job.id as string);

            return await createJob(job);
        } catch (err: any) {
            throw err;            
        }
    }

    async createInstanceSnapshot(project: Project, instance: Instance): Promise<Job> {
        const logger = getLogger('instance-snapshot-job');
        try {

            const job = await queues.stopInstance(project, instance);
 
            const projRepo = beanFactory.getProjectRepository();
            await projRepo.addInstanceJob(instance.id as string, job.id as string);

            return await createJob(job);
        } catch (err: any) {
            throw err;            
        }

    }

    /*
    async deleteInstanceSnapshot(project: Project, instance: Instance, snapshot: string): Promise<Job> {

    }

    async createInstanceSchedule(project: Project, instance: Instance, scheduleRequest: SnapshotScheduleRequest): Promise<Job> {

    }

    async deleteInstanceSchedule(project: Project, instance: Instance, schedule: string): Promise<Job> {

    }

    async getProjectJobs(projectid: string): Promise<Job[]> {

    }
    
    async getProjectJob(projectid: string, jobid: string): Promise<Job> {

    }
    
    async cancelProjectJob(projectid: string, jobid: string): Promise<Job> {

    }

    async getInstanceJobs(instanceid: string): Promise<Job[]> {

    }
    
    async getInstanceJob(instanceid: string, jobid: string): Promise<Job> {

    }
    
    async cancelInstanceJob(instanceid: string, jobid: string): Promise<Job> {

    }
*/

}

async function createJob(job: any) {
    return {
        id: job.id as string,
        created: "",
        name: job.name,
        active: await job.isActive(),
        completed: await job.isCompleted(),
        delayed: await job.isDelayed(),
        failed: await job.isFailed(),
        waiting: await job.isFailed(),
        finishedOn: job.finishedOn as number,
        failedReason: job.failedReason            
    }
}

export default new JobService();
