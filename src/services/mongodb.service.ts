import mongoose from "mongoose";
import { Database } from "../interfaces";

const ConnectionString = process.env.MONGO_DB_CONNECTION_STRING || "mongodb://localhost:27017/zbiRepo";
const RetrySeconds = parseInt(process.env.MONGO_DB_RETRY_SECONDS || "5");
const ServerSelectionTimeout = parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT || "5000");
const UseUnitedTopology = Boolean(process.env.MONGO_USE_UNITED_TOPOLOGY || "true");
const UseNewUrlParser = Boolean(process.env.MONGO_USE_NEW_URL_PARSER || "true");

export class MongoDB implements Database {

    private mongooseOptions = {
        useNewUrlParser: UseNewUrlParser,
        useUnitedTopology: UseUnitedTopology,
        serverSelectionTimeoutMS: ServerSelectionTimeout
    };

    async init(): Promise<void> {
    }

    async connect(): Promise<void> {

        mongoose.connect(ConnectionString, this.mongooseOptions)
            .then(() => {})
            .catch((err) => {})
    }
    
    async close(): Promise<void> {
        mongoose.connection.close();
    }

    async clear(): Promise<void> {
        mongoose.connection.dropDatabase();
    }  
}
