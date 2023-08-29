import { ObjectSchema } from "joi";
import { getLogger } from "./logger";
import { Logger } from "winston";
import { ServiceError, ServiceType } from "./errors";


export class FieldError {
    public readonly name: string;
    public readonly error: string;

    constructor(name: string, error: string) {
        this.name = name;
        this.error = error;
    }
}

export class ValidationResponse {
    public success: boolean;
    public fields: FieldError[];
    public message: string;

    constructor(success: boolean, message: string, fields: FieldError[]) {
        this.message = message;
        this.success = success;
        this.fields = fields;
    }
}


export const validateObject = async (schema: ObjectSchema, data: any) => {

    const logger: Logger = getLogger('request-validator');

    try {
        const result = await schema.validate(data, {abortEarly: false});
        if (result.error && result.error.details) {
            const fieldErrors = result.error.details.map((error:any) => {
                //logger.info(`key: ${error.path[0]}, error: ${error.message}`);
                //return new FieldError(error.context.label, error.message);
                // const m = new Map();
                // m.set(error.context.label, error.message);
                // logger.debug(`returning error: ${JSON.stringify(Object.fromEntries(m))}`);
                // return Object.fromEntries(m);
                return [error.context.label, error.message];
            })

            const fields = Object.fromEntries(fieldErrors);
            logger.info(`validation error: ${JSON.stringify(fields)}`);
            return {success: false, fields};
        }   
        return {success: true};
    } catch (err: any) {
        logger.error(`validation error: ${JSON.stringify(err)}`);
        throw new ServiceError(ServiceType.network, err.message);
    }
}
