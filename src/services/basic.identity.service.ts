import axios, { HttpStatusCode } from "axios";
import { AuthRequest, AuthResult, QueryParam, RegisterRequest, RegisterResult, User, UserInfo } from "../model/model";
import { AuthenticationClient, ManagementClient } from 'auth0';
import { ServiceError, ServiceErrorType } from "../libs/errors";
import { IdentityService, UserRepository } from "../interfaces";
import { Handler } from "express";
import { auth } from 'express-oauth2-jwt-bearer';
import { NextFunction, Request, Response } from 'express';
import { FilterConditionType, RoleType, UserFilterType, UserStatusType } from "../model/zbi.enum";
import { hashPassword, comparePassword, signJwt } from "../libs/auth.libs";
import config from "config";
import { getLogger } from "../libs/logger";

export default class BasicIdentityService implements IdentityService {

    private repository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.repository = userRepository;

        //TODO - create admin user if not exists
    }

    // async createUser(email: string, name: string, role: RoleType, status: UserStatusType): Promise<User> {        
    //     return await this.repository.createUser(email, name, role, status);
    // }

    // async updateUser(email: string, name: string, status: UserStatusType): Promise<User> {
    //     return this.repository.updateUser(email, name, status);
    // }

    // async getUserById(userid: string): Promise<User> {

    //     const param: QueryParam = {name: UserFilterType.userid, condition: FilterConditionType.equal, value: userid};
    //     const user: User = await this.repository.findUser(param);

    //     return user;
    // }

    // async getUserByEmail(email: string): Promise<User> {
    //     const param: QueryParam = {name: UserFilterType.email, condition: FilterConditionType.equal, value: email};
    //     const user: User = await this.repository.findUser(param);

    //     return user;
    // }

    // async setPassword(email: string, password: string): Promise<void> {
    //     return this.repository.setPassword(email, password);
    // }

    // async resetPassword(userid: string): Promise<void> {
    //     throw new Error("Method not implemented.");
    // }

    // async deactivateUser(userid: string): Promise<void> {
    //     return this.repository.deactivateUser(userid);
    // }

    // async activateUser(userid: string): Promise<void> {
    //     return this.repository.activateUser(userid);
    // }

    // async deleteUser(userid: string): Promise<void> {
    //     return this.repository.deleteUser(userid);
    // }

    // async getAccountActivity(userid: string): Promise<void> {
    //     throw new Error("Method not implemented.");
    // }

    // getLoginURL(): string {
    //     throw new Error("Method not implemented.");
    // }

    // getAccessVerifier(): Handler {
    //     return function(request: Request, response: Response, next: NextFunction) {

    //         next();
    //     };
    // }

    async authenticateUser(request: AuthRequest): Promise<AuthResult> {

        const logger = getLogger("authenticate-user");
        try {
            const email = request.email as string;
            const password = request.password as string;

            const user = await this.repository.validatePassword(email, password);
            logger.debug(`found user: ${JSON.stringify(user)}`);
            if(!user) {
                return {valid: false, registered: false};
            }

            return {email, valid: true, registered: true, user};
        } catch (e: any) {
            throw e;            
        }

    }

    // async registerUser(user: RegisterRequest): Promise<RegisterResult> {
    //     try {


    //         // generate token
    //         return {};
    //     } catch (e: any) {
    //         throw e;            
    //     }

    // }

}

