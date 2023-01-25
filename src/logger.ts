import { createLogger, format, transports, addColors } from "winston";
import context from "./context";
import {v4 as uuidv4} from 'uuid';
import morgan, {StreamOptions} from "morgan";

const { combine, label, timestamp, printf, json, colorize } = format;


addColors({error: 'red', warn: 'yellow', info: 'green', http: 'magenta', debug: 'white'});
const console = new transports.Console();

const logFormat = printf(({level, message, label: logLabel, timestamp: logTimeStamp, requestid, userid, service}) => {
    return `${level} | ${logTimeStamp} | ${requestid} | ${userid} | ${service} | ${message}`;
});

export const defaultLogger = createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: combine(label({label: process.env.NODE_ENV}), timestamp(), logFormat, colorize({all: true})),
    transports: [console],
});

export const mainLogger = defaultLogger.child({requestid: uuidv4(), userid: "zbi", service: "main"});

export const morganStream: StreamOptions = {write: (message: string) => mainLogger.http(message)};

// export const logger = new Proxy(defaultLogger/*.child({requestId: uuidv4(), user: "zbi"})*/, {
//     get(target, property, receiver) {
//       target = context.getStore()?.get('logger') || target;
//       return Reflect.get(target, property, receiver);
//     },
// });

export const getLogger = (service: string) => {
    let x = context.getStore()?.get('logger');

    let logger = context.getStore()?.get('logger') || mainLogger;
    return logger.child({service});
}
