import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";
import { getLogger } from "../logger";
import { Logger } from "winston";
import { FieldError } from "../errors";
import { HttpStatusCode } from "axios";

export const validator = (schema: ObjectSchema) => {

    return async (request: Request, response: Response, next: NextFunction) => {
        const logger: Logger = getLogger('zbi.validator');

        try {
            const result = await schema.validate(request.body, {abortEarly: false});
            if (result.error && result.error.details) {
                const fieldErrors = result.error.details.map((error:any) => {
                    logger.info(`key: ${error.path[0]}, error: ${error.message}`);
                    return new FieldError(error.context.label, error.message);
                })
                logger.info(`validation error: ${JSON.stringify(fieldErrors)}`);
                response.status(HttpStatusCode.UnprocessableEntity).json({
                    message: 'Invalid request',
                    errors: fieldErrors
                });
            }   
        } catch (err) {
            logger.error(`validation error: ${JSON.stringify(err)}`);
        }

        next();
    }
}

// {"_original":{"name":"test","network":"testne"},"details":[{"message":"\"network\" must be one of [testnet, mainnet]","path":["network"],"type":"any.only","context":{"valids":["testnet","mainnet"],"label":"network","value":"testne","key":"network"}}]}

// [
//     {
//         "message":"\"network\" must be one of [testnet, mainnet]",
//         "path":["network"],
//         "type":"any.only",
//         "context":
//         {
//             "valids":["testnet","mainnet"],
//             "label":"network",
//             "value":"testne",
//             "key":"network"
//         }
//     }
// ]
  