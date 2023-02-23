import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";
import { getLogger } from "../logger";
import { Logger } from "winston";
import { FieldError, ValidationError } from "../errors";
import { HttpStatusCode } from "axios";

import { validateObject } from "../libs/validator";

export const validator = (schema: ObjectSchema) => {

    return async (request: Request, response: Response, next: NextFunction) => {
        const logger: Logger = getLogger('zbi.validator');

        try {

            const result = await validateObject(schema, request.body.project );
            if(!result.success) {

                logger.error(`error = ${JSON.stringify(result.error)} ${typeof result.error}`);

                if(typeof result.error == typeof ValidationError ) {
                    const error:ValidationError = result.error as ValidationError;
                    logger.error(`error = ${JSON.stringify(error)}`);
                    response.status(error.code).json({message: error.message, errors: error.fields})
                    return;
                }
                const code = result.error?.code||HttpStatusCode.InternalServerError;
                response.status(code).json({message: result.error?.message});
                return;
            }
            // const result = await schema.validate(request.body.project, {abortEarly: false});
            // if (result.error && result.error.details) {
            //     const fieldErrors = result.error.details.map((error:any) => {
            //         logger.info(`key: ${error.path[0]}, error: ${error.message}`);
            //         return new FieldError(error.context.label, error.message);
            //     })
            //     logger.info(`validation error: ${JSON.stringify(fieldErrors)}`);
            //     response.status(HttpStatusCode.UnprocessableEntity).json({
            //         message: 'Invalid request',
            //         errors: fieldErrors
            //     });
            //     return;
            // }   
        } catch (err: any) {
            logger.error(`validation error: ${JSON.stringify(err)}`);
            response.status(HttpStatusCode.InternalServerError).json({message: err.message});
            return;
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
  