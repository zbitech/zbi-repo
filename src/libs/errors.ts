import { HttpStatusCode } from "axios";

export enum ServiceErrorType {
    UNAVAILABLE = "unavailable",
    NOT_FOUND = "notfound",
    VALIDATION = "validation",
    BAD_PARAMETER = "badparameter",
}

export enum AppErrorType {
    UNREGISTERED_USER = 100,
    USER_NOT_PERMITTED = 200,
    USER_NOT_ACTIVE = 300,
    USER_NOT_INACTIVE = 400
}

export class FieldError {
    public readonly name: string;
    public readonly error: string;

    constructor(name: string, error: string) {
        this.name = name;
        this.error = error;
    }
}

export class ServiceError extends Error {
    public errorType: ServiceErrorType;

    constructor(errorType: ServiceErrorType, message: string) {
        super();
        this.errorType = errorType;
        this.message = message;
    }

    getAppError() {
        switch(this.errorType) {
            case ServiceErrorType.NOT_FOUND:
                return new NotFoundError(this.message);
        }
    }
}

export class ApplicationError extends Error {
    public code: number = 0;

    constructor(code: number, message: string, ...args: any) {
        super(...args);
        this.code = code;
        this.message = message;
    }
}

export class BadRequestError extends ApplicationError {
    constructor(message: string, ...args: any) {
        super(HttpStatusCode.BadRequest, message, ...args);
    }
}

export class ValidationError extends ApplicationError {
    public fields: FieldError[];

    constructor(message: string, fields: FieldError[], ...args: any) {
        super(HttpStatusCode.UnprocessableEntity, message, ...args);
        this.fields = fields;
    }
}

export class NotFoundError extends ApplicationError {
    constructor(message: string) {
      super(HttpStatusCode.NotFound, message, arguments);
    }
}

export class InternalServerError extends ApplicationError {
    constructor(message: string) {
      super(HttpStatusCode.InternalServerError, message, arguments);
    }
}