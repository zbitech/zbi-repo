import { createLogger, format, transports } from "winston";

const { combine, label, timestamp, printf } = format;

const console = new transports.Console();

const logFormat = printf(({level, message, label: logLabel, timestamp: logTimeStamp}) => {
    return `${logTimeStamp} [${level}]: ${message}`;
});

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(label({label: process.env.NODE_ENV}), timestamp(), logFormat),
    transports: [console],
});

export default logger;