import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema, string } from "joi";
import { getLogger } from "../libs/logger";
import { Logger } from "winston";
import { HttpStatusCode } from "axios";

import { validateObject } from "../libs/validator";
import { Action, Permission } from "../model/zbi.enum";
import beanFactory from "../factory/bean.factory";



export const validateUserPermission = (permission: Permission) => {

    return async (request: Request, response: Response, next: NextFunction) => {
        const logger: Logger = getLogger('user-perm');

        try {

            const accessService = beanFactory.getAccessService();

            const subject = response.locals.subject;

            const allowed = await accessService.validateUserPermission(subject, permission);
            if(allowed) {
                console.info(`user is allowed to perform ${permission} on user`);
                next();
            } else {
                response.status(HttpStatusCode.Forbidden).json({message: 'You are not authorized to perform this action'});
                return;
            }

        } catch (err: any) {
            logger.error(`validation error: ${JSON.stringify(err)}`);
            response.status(HttpStatusCode.InternalServerError).json({message: err.message});
            return;
        }
    }
}

export const validateTeamPermission = (permission: Permission) => {

    return async (request: Request, response: Response, next: NextFunction) => {
        const logger: Logger = getLogger('team-perm');

        try {

            const accessService = beanFactory.getAccessService();

            const subject = response.locals.subject;

            const allowed = await accessService.validateTeamPermission(subject, permission);
            if(allowed) {
                next();
            } else {
                response.status(HttpStatusCode.Forbidden).json({message: 'You are not authorized to perform this action'});
                return;
            }

        } catch (err: any) {
            logger.error(`validation error: ${JSON.stringify(err)}`);
            response.status(HttpStatusCode.InternalServerError).json({message: err.message});
            return;
        }
    }
}

export const validateProjectPermission = (permission: Permission) => {

    return async (request: Request, response: Response, next: NextFunction) => {
        const logger: Logger = getLogger('project-permi');

        try {

            const accessService = beanFactory.getAccessService();

            const subject = response.locals.subject;

            const allowed = await accessService.validateProjectPermission(subject, permission);
            if(allowed) {
                next();
            } else {
                response.status(HttpStatusCode.Forbidden).json({message: 'You are not authorized to perform this action'});
                return;
            }

        } catch (err: any) {
            logger.error(`validation error: ${JSON.stringify(err)}`);
            response.status(HttpStatusCode.InternalServerError).json({message: err.message});
            return;
        }
    }
}

export const validateInstancePermission = (permission: Permission) => {

    return async (request: Request, response: Response, next: NextFunction) => {
        const logger: Logger = getLogger('instance-perm');

        try {

            const accessService = beanFactory.getAccessService();

            const subject = response.locals.subject;

            const allowed = await accessService.validateInstancePermission(subject, permission);
            if(allowed) {
                next();
            } else {
                response.status(HttpStatusCode.Forbidden).json({message: 'You are not authorized to perform this action'});
                return;
            }

        } catch (err: any) {
            logger.error(`validation error: ${JSON.stringify(err)}`);
            response.status(HttpStatusCode.InternalServerError).json({message: err.message});
            return;
        }
    }
}

export const validateResourcePermission = (permission: Permission) => {

    return async (request: Request, response: Response, next: NextFunction) => {
        const logger: Logger = getLogger('resource-perm');

        try {

            const accessService = beanFactory.getAccessService();

            const subject = response.locals.subject;

            const allowed = await accessService.validateResourcePermission(subject, permission);
            if(allowed) {
                next();
            } else {
                response.status(HttpStatusCode.Forbidden).json({message: 'You are not authorized to perform this action'});
                return;
            }

        } catch (err: any) {
            logger.error(`validation error: ${JSON.stringify(err)}`);
            response.status(HttpStatusCode.InternalServerError).json({message: err.message});
            return;
        }
    }
}

export const checkActionLimit = (action: string[]) => {

    return async (request: Request, response: Response, next: NextFunction) => {
        const logger: Logger = getLogger('verify-permissions');

        try {

            const my_scopes = request.auth;

            if(!true) {
                const code = HttpStatusCode.Forbidden;
                response.status(code).json({message: 'You are not authorized to perform this action'});
                return;
            }

        } catch (err: any) {
            logger.error(`validation error: ${JSON.stringify(err)}`);
            response.status(HttpStatusCode.InternalServerError).json({message: err.message});
            return;
        }

        next();
    }
}
