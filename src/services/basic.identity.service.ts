import axios, { HttpStatusCode } from "axios";
import { QueryParam, User, UserInfo } from "../model/model";
import { AuthenticationClient, ManagementClient } from 'auth0';
import { ServiceError, ServiceErrorType } from "../libs/errors";
import { IdentityService, UserRepository } from "../interfaces";
import { Handler } from "express";
import { auth } from 'express-oauth2-jwt-bearer';
import { NextFunction, Request, Response } from 'express';
import { FilterConditionType, UserFilterType } from "src/model/zbi.enum";

export default class BasicIdentityService implements IdentityService {

    private repository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.repository = userRepository;

        //TODO - create admin user if not exists
    }

    async createUser(user: User): Promise<User> {
        return this.repository.createUser(user);
    }

    async updateUser(user: User): Promise<User> {
        return this.repository.updateUser(user);
    }

    async getUserById(userid: string): Promise<User> {

        const param: QueryParam = {name: UserFilterType.userid, condition: FilterConditionType.equal, value: userid};
        const user: User = await this.repository.findUser(param);

        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        const param: QueryParam = {name: UserFilterType.email, condition: FilterConditionType.equal, value: email};
        const user: User = await this.repository.findUser(param);

        return user;
    }

    async resetPassword(userid: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async deactivateUser(userid: string): Promise<void> {
        return this.repository.deactivateUser(userid);
    }

    async activateUser(userid: string): Promise<void> {
        return this.repository.activateUser(userid);
    }

    async deleteUser(userid: string): Promise<void> {
        return this.repository.deleteUser(userid);
    }

    async getAccountActivity(userid: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getLoginURL(): string {
        throw new Error("Method not implemented.");
    }

    getAccessVerifier(): Handler {
        return function(request: Request, response: Response, next: NextFunction) {

            next();
        };
    }

}

