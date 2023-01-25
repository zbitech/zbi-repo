import { Database } from "../../interfaces";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { mainLogger as logger } from "../../logger";

const dbOpts = {
    instance: {dbName: 'zbiRepo'/*, dbPath: './_db'*/},
    binary: {downloadDir: './'},
};
const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.set('strictQuery', false);

export class MongoMemoryDB implements Database {

    mongod: any = null;

    constructor() {
    }

    async init(): Promise<void> {
        logger.info("initializing db");
        this.mongod = await MongoMemoryServer.create(dbOpts);
        logger.info("db initialized");
    }

    async connect(): Promise<void> {
        const uri = this.mongod.getUri("zbiRepo");
        await mongoose.connect(uri);
        logger.info("connected to memory server");
    }

    async close(): Promise<void> {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await this.mongod.stop();

        logger.info("closed connection");
    }
    
    async clear(): Promise<void> {
        const collections = mongoose.connection.collections;

        for(const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }
}
