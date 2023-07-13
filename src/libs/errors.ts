import { HttpStatusCode } from "axios";
import { Http } from "winston/lib/winston/transports";

// export enum ServiceErrorType {
//     UNAVAILABLE = "unavailable",
//     NOT_FOUND = "notfound",
//     VALIDATION = "validation",
//     BAD_PARAMETER = "badparameter",
// }

export enum ItemType {
    user = 0,
    team = 1,
    membership = 2,
    project = 3,
    instance = 4,
    resource = 5
}

export enum ServiceType {
    database = 0,
    controller = 1,
    file = 2,
    network = 3,
}

// export enum AppErrorType {
//     DB_SERVICE_ERROR = 1,
//     UNREGISTERED_USER = 100,
//     USER_NOT_PERMITTED = 200,
//     USER_NOT_ACTIVE = 300,
//     USER_NOT_INACTIVE = 400,
//     EMAIL_ALREADY_EXISTS = 500,
//     INVALID_LOGIN_PROVIDER = 600

// }

// export class FieldError {
//     public readonly name: string;
//     public readonly error: string;

//     constructor(name: string, error: string) {
//         this.name = name;
//         this.error = error;
//     }
// }

export class AppResponse {
    public code: number;
    public message: string;

    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }
}

// export class ValidationResponse extends AppResponse {
//     public success: boolean;
//     public fields: FieldError[];

//     constructor(success: boolean, message: string, fields: FieldError[]) {
//         super(HttpStatusCode.UnprocessableEntity, message);
//         this.success = success;
//         this.fields = fields;
//     }
// }

export function handleError(err: Error) {

    if(err instanceof ItemNotFoundError) {
        return {code: HttpStatusCode.NotFound, message: err.message};
    } 
    
    else if(err instanceof ItemAlreadyExistsError || err instanceof BadRequestError) {
        return {code: HttpStatusCode.BadRequest, message: err.message};
    } 
    
    else if(err instanceof ResourcePermissionError) {
        return {code: HttpStatusCode.Forbidden, message: err.message};
    } 

    else if(err instanceof ResourceQuotaExceededError) {
        return {code: HttpStatusCode.TooManyRequests, message: err.message};
    }

    else if(err instanceof ServiceError) {
        return {code: HttpStatusCode.InternalServerError, message: err.message};
    }

    return {code: HttpStatusCode.InternalServerError, message: "Internal ServerError"};
} 


export class ApplicationError extends Error {
    public code: number = 0;

    constructor(code: number, message: string, ...args: any) {
        super(...args);
        this.code = code;
        this.message = message;
    }
}

// export class ValidationError extends ApplicationError {
//     public fields: FieldError[];

//     constructor(message: string, fields: FieldError[], ...args: any) {
//         super(HttpStatusCode.UnprocessableEntity, message, ...args);
//         this.fields = fields;
//     }
// }

export class ServiceError extends Error {
    public service: ServiceType;

    constructor(service: ServiceType, message: string) {
        super(message);
        this.service = service;        
    }

}

export class BadRequestError extends Error {

}

export class DataError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DataError";
    }
}

export class ItemAlreadyExistsError extends DataError {
    public item: ItemType;

    constructor(item: ItemType, message: string) {
        super(message);
        this.item = item;
    }
}

export class ItemNotFoundError extends DataError {
    public item: ItemType;

    constructor(item: ItemType, message: string) {
        super(message);
        this.item = item;
    }
}

export class ResourcePermissionError extends Error {

}

export class ResourceQuotaExceededError extends Error {

}

export class UserError {

}

export class InstanceError {

}