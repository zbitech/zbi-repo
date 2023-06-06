import { IJobRepository, UserRepository } from "../../interfaces";
import { QueryParam } from "../../model/model";
import { FilterConditionType, LoginProvider  } from "../../model/zbi.enum";
import model from "./mongo.model";
import * as helper from "./helper";
import { getLogger } from "../../libs/logger";
import { Logger } from "winston";
import { hashPassword, comparePassword } from "../../libs/auth.libs";
import { AppErrorType, ApplicationError } from "../../libs/errors";
import { Job } from "auth0";

export default class JobMongoRepository implements IJobRepository {

    // async createProjectJob(userid: string, id: string, type: JobType): Promise<Job> {
    //     throw new Error("Method not implemented.");
    // }

    // async createInstanceJob(userid: string, id: string, type: JobType): Promise<Job> {
    //     throw new Error("Method not implemented.");
    // }

    // async createResourceJob(userid: string, id: string, resource: string, type: Job): Promise<Job> {
    //     throw new Error("Method not implemented.");
    // }

    // async getJobs(params: QueryParam, size: number, page: number): Promise<Job[]> {
    //     throw new Error("Method not implemented.");
    // }

    // async getJob(id: string): Promise<Job> {
    //     throw new Error("Method not implemented.");
    // }

    // async updateJob(id: string, job: Job): Promise<Job> {
    //     throw new Error("Method not implemented.");
    // }

    // async deleteJob(id: string): Promise<Job> {
    //     throw new Error("Method not implemented.");
    // }

}