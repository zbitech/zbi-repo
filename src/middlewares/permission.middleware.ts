import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema, string } from "joi";
import { getLogger } from "../libs/logger";
import { Logger } from "winston";
import { FieldError, ValidationError } from "../libs/errors";
import { HttpStatusCode } from "axios";

import { validateObject } from "../libs/validator";

export const checkPermissions = (scopes: string[]) => {

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
