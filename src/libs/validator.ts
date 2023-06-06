import { ObjectSchema } from "joi";
import { getLogger } from "./logger";
import { Logger } from "winston";
import { FieldError, InternalServerError, ValidationError } from "./errors";

export const validateObject = async (schema: ObjectSchema, data: any) => {

    const logger: Logger = getLogger('zbi.validator');

    try {
        const result = await schema.validate(data, {abortEarly: false});
        if (result.error && result.error.details) {
            const fieldErrors = result.error.details.map((error:any) => {
                logger.info(`key: ${error.path[0]}, error: ${error.message}`);
                return new FieldError(error.context.label, error.message);
            })

            logger.info(`validation error: ${JSON.stringify(fieldErrors)}`);
            return {success: false, error: new ValidationError("validation error", fieldErrors)};
        }   
        return {success: true};
    } catch (err: any) {
        logger.error(`validation error: ${JSON.stringify(err)}`);
        return {success: false, error: new InternalServerError(err.message)};
    }
}
