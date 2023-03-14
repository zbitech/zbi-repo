import axios, { HttpStatusCode } from "axios";
import { User, UserInfo } from "../model/model";
import { AuthenticationClient, ManagementClient } from 'auth0';
import { ServiceError, ServiceErrorType } from "../libs/errors";
import { IdentityService, UserRepository } from "../interfaces";
import { Handler } from "express";
import { auth } from 'express-oauth2-jwt-bearer';
import { NextFunction, Request, Response } from 'express';

export default class BasicIdentityService implements IdentityService {

    private repository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.repository = userRepository;
    }

    createUser(user: User): Promise<User> {
        return this.repository.createUser(user);
    }

    updateUser(user: User): Promise<User> {
        return this.repository.updateUser(user);
    }

    getUserById(userid: string): Promise<User> {
        throw new Error("Method not implemented.");
    }

    getUserByEmail(email: string): Promise<User> {
        throw new Error("Method not implemented.");
    }

    resetPassword(userid: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    deactivateUser(userid: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    reactivateUser(userid: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    deleteUser(userid: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getAccountActivity(userid: string): Promise<void> {
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

