//import Queue from "bull";
import { Queue, Worker, Job, QueueEvents } from "bullmq";
import { Instance, Project } from "../model/model";
import beanFactory from "../factory/bean.factory";
import { getLogger } from "./logger";


const redis = process.env.REDIS || 'redis-mem';
const redisUrl = process.env.REDIS_URL || 'localhost';

console.log(`connecting to redis @ ${redisUrl}`);

const opt = {
    connection: {
        host: redisUrl,
        port: 6379
    }
};



(async function(){
    console.log("Hello world!");    
})();

console.log(`creating queues ...`);
const projectQueue = new Queue('project', opt);
const instanceQueue = new Queue('instance', opt);
//const snapshotQueue = new Queue('resource', opt);
//const scheduleQueue = new Queue('resource', opt);
//const emailQueue = new Queue('email', opt);

console.log(`creating queue workers ...`);
const projectQueueWorker = new Worker('project', async (job: Job) => handleProjectTask(job), opt);
const instanceQueueWorker = new Worker('instance', async (job: Job) => handleInstanceTask(job), opt);
//const snapshotQueueWorker = new Worker('resource', async (job: Job) => handleSnapshotResourceTask(job), opt);
//const scheduleQueueWorker = new Worker('resource', async (job: Job) => handleScheduleResourceTask(job), opt);
//const emailQueueWorker = new Worker('email', async (job: Job) => sendEmailTask(job), opt);

console.log(`queue setup complete`);


export const init = async() => {
    console.log(`initializing queues ...`);
}

export const closeQueue = async() => {
    await projectQueue.close();
//    await instanceQueue.close();
//    await snapshotQueue.close();
//    await scheduleQueue.close();
//    await emailQueue.close();
}


export const createProject = async(project: Project) => {
    const task = 'create';
    console.log(`adding ${task} project task for ${project.id}`);
    return await projectQueue.add('create', {task, project});
}

export const repairProject = async(project: Project) => {
    const task = 'repair';
    return await projectQueue.add('repair', {task, project});
}

export const deleteProject = async(project: Project) => {
    const task = 'delete';
    return await projectQueue.add('delete', {task, project});
}

export const createInstance = async(project: Project, instance: Instance) => {
    const task = 'create';
    return await instanceQueue.add('create', {task, project, instance});
}

export const updateInstance = async(project: Project, instance: Instance) => {
    const task = 'update';
    return await instanceQueue.add('update', {task, project, instance});
}

export const startInstance = async(project: Project, instance: Instance) => {
    const task = 'start';
    return await instanceQueue.add('start', {task, project, instance});
}

export const stopInstance = async(project: Project, instance: Instance) => {
    const task = 'stop';
    return await instanceQueue.add('stop', {task, project, instance});
}

export const repairInstance = async(project: Project, instance: Instance) => {
    const task = 'repair';
    return await instanceQueue.add('repair', {task, project, instance});
}

export const deleteInstance = async(project: Project, instance: Instance) => {
    const task = 'delete';
    return await instanceQueue.add('delete', {task, project, instance});
}



projectQueueWorker.on('completed', (job: Job) => {

});

projectQueueWorker.on('failed', (job: Job|undefined, err: Error) => {

});

// instanceQueueWorker.on('completed', (job: Job) => {

// });

// instanceQueueWorker.on('failed', (job: Job|undefined, err: Error) => {

// });


const handleProjectTask = async (job: Job) => {
    const logger = getLogger('project-queue');

    const { task, project } = job.data;
    console.log(`handling project ... task=${task}, project=${project.id}`);

    const ctrlService = beanFactory.getControllerService();

    console.log(`retrieved project detail - ${JSON.stringify(project)}`);

    let response: any = null;
    let success: boolean = true;

    switch(task) {
        case "create":
            response = await ctrlService.createProject(project);
            break;

        case "delete":
            response = await ctrlService.deleteProject(project);
            break;

        case "repair":
            response = await ctrlService.repairProject(project);
            break;

        default:
            success = false;
    }

    logger.info(`action = ${task}, response = ${JSON.stringify(response)}`);
    
    return Promise.resolve({success, response});
}

const handleInstanceTask = async (job: Job) => {
    const logger = getLogger('instance-queue');

    const { task, project, instance} = job.data;
    const ctrlService = beanFactory.getControllerService();

    let response: any = null;
    let success: boolean = true;

    switch(task) {
        case "create":
            response = await ctrlService.createInstance(project, instance);
            break;
            
        case "delete":
            response = await ctrlService.deleteInstance(project.name, instance.name);
            break;

        case "repair":
            response = await ctrlService.repairInstance(project, instance);
            break;

        case "start":
            response = await ctrlService.startInstance(project, instance);
            break;

        case "stop":
            response = await ctrlService.stopInstance(project, instance);
            break;

        default:
            success = false;

    }

    logger.info(`action = ${task}, response = ${JSON.stringify(response)}`);
    return Promise.resolve({success, response});

}

const handleSnapshotResourceTask = async (job: Job) => {
    const logger = getLogger('resource-queue');

    const { task, project, instance, resourceName, resourceType} = job.data;

    const projService = beanFactory.getProjectService();
    const ctrlService = beanFactory.getControllerService();

    let response: any = null;
    let success: boolean = true;

    switch(task) {
        case "create":
            response = await ctrlService.createInstanceSnapshot(project, instance);
            break;
            
        case "delete":
            response = await ctrlService.deleteInstance(project.name, instance.name);
            break;

        default:
            success = false;

    }

    return Promise.resolve({success, response});    
}

const handleScheduleResourceTask = async (job: Job) => {
    const logger = getLogger('resource-queue');

    const { task, project, instance, resourceName, resourceType} = job.data;

    const ctrlService = beanFactory.getControllerService();

    let response: any = null;
    let success: boolean = true;

    switch(task) {
        case "create":
            response = await ctrlService.createInstanceSnapshot(project, instance);
            break;
            
        case "delete":
            response = await ctrlService.deleteInstance(project.name, instance.name);
            break;

        default:
            success = false;

    }

    return Promise.resolve({success, response});    
}

const sendEmailTask = async (job: Job) => {

}



// instanceQueue.process(async (job:any) => {

//     const { slug, task } = job.data;

//     try {
//         switch (task) {
//             case "start":
                
//                 break;
        
//             case "stop":
                
//             default:
//                 return Promise.resolve({sent: true, slug});
//         }
        
//     } catch (err) {
//         return Promise.reject(err);
//     }
// });
