import mongoose from "mongoose";
import { Database } from "../interfaces";
import { mainLogger as logger } from "../libs/logger";


const ConnectionString = process.env.MONGO_DB_CONNECTION_STRING || "mongodb://localhost:27017/zbiRepo";
const RetrySeconds = parseInt(process.env.MONGO_DB_RETRY_SECONDS || "5");
const ServerSelectionTimeout = parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT || "5000");
const UseUnitedTopology = Boolean(process.env.MONGO_USE_UNITED_TOPOLOGY || "true");
const UseNewUrlParser = Boolean(process.env.MONGO_USE_NEW_URL_PARSER || "true");

export class MongoDB implements Database {

    private mongooseOptions = {
        useNewUrlParser: UseNewUrlParser,
        serverSelectionTimeoutMS: ServerSelectionTimeout
    };

    async init(): Promise<void> {
        logger.info(`initializing mongo db`);
    }

    async connect(): Promise<void> {

        logger.info(`connecting to mongodb @ ${ConnectionString} with options - ${JSON.stringify(this.mongooseOptions)}`);
        mongoose.connect(ConnectionString, this.mongooseOptions)
            .then(() => {
                logger.info(`connected to mongodb @ ${ConnectionString}`);
            })
            .catch((err: any) => {
                logger.error(`failed to connect to mongodb - ${err}`);
            })
    }
    
    async close(): Promise<void> {
        mongoose.connection.close();
    }

    async clear(): Promise<void> {
        mongoose.connection.dropDatabase();
    }  
}
