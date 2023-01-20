import {Request, Response, NextFunction} from 'express';
import { createLogger, format, transports } from "winston";
import context from "./context";
import uuid from 'uuid';

const { combine, label, timestamp, printf, json, colorize } = format;

const console = new transports.Console();

const logFormat = printf(({level, message, label: logLabel, timestamp: logTimeStamp, requestId}) => {
    return `${level} | ${logTimeStamp} | ${requestId} | ${message}`;
});

export const defaultLogger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(label({label: process.env.NODE_ENV}), timestamp(), logFormat, colorize({all: true})),
    transports: [console],
});

//export default logger;

export const logger = new Proxy(defaultLogger.child({requestId: "zbi"}), {
    get(target, property, receiver) {
      target = context.getStore()?.get('logger') || target;
      return Reflect.get(target, property, receiver);
    },
});

module.exports.contextMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const child = logger.child({ requestId: uuid.v4() });
    const store = new Map();
  
    return context.run(store, () => {
        store.set('logger', child);

        next();
    });
};
