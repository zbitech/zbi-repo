
export enum ServiceErrorType {
    UNAVAILABLE = "unavailable",
    NOT_FOUND = "notfound",
    VALIDATION = "validation",
    BAD_PARAMETER = "badparameter",
}

export class FieldError {
    public readonly name: string = "";
    public readonly error: string = "";

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
        super(400, message, ...args);
    }
}

export class ValidationError extends BadRequestError {
    public fields: FieldError[];

    constructor(message: string, fields: FieldError[], ...args: any) {
        super(message, ...args);
        this.fields = fields;
    }
}

export class NotFoundError extends ApplicationError {
    constructor(message: string) {
      super(404, message, arguments);
    }
}

export class InternalError extends ApplicationError {
    constructor(message: string) {
      super(500, message, arguments);
    }
}