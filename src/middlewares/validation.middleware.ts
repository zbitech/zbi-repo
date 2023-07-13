import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";
import { getLogger } from "../libs/logger";
import { Logger } from "winston";
import { HttpStatusCode } from "axios";

import { validateObject } from "../libs/validator";
import beanFactory from "../factory/bean.factory";

export const validateRequest = (schema: ObjectSchema) => {

    return async (request: Request, response: Response, next: NextFunction) => {
        const logger: Logger = getLogger('zbi.validator');

        try {

            const payload = {body: request.body, query: request.query, params: request.params};
            const result = await validateObject(schema, payload);

            if(!result.success) {
                logger.error(`validation error = ${JSON.stringify(result.fields)}`);
                response.status(HttpStatusCode.BadRequest).json({message: "Your message could not be processed", errors: result.fields})
            }

        } catch (err: any) {
            logger.error(`validation error: ${JSON.stringify(err)}`);
            response.status(HttpStatusCode.InternalServerError).json({message: err.message});
            return;
        }

        next();
    }
}

export const validateDuplicateEmail = async (request: Request, response: Response, next: NextFunction) => {
    const logger: Logger = getLogger('email.validator');

    const email = request.body.email;
    const userService = beanFactory.getUserService();

    try {
        logger.debug(`checking for duplicate email - ${email}`);
        const user = await userService.getUserByEmail(email);
        if(user) {
            response.status(HttpStatusCode.UnprocessableEntity).json({message: "User with email already exists.", errors: [{name: "email", error: "\"email\" already exists"}]});
            return;
        }            
    } catch (err: any) {}

    next();
}    
