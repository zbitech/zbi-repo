import { Database } from "../../interfaces";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

const dbOpts = {
    instance: {dbName: 'zbiRepo'/*, dbPath: './_db'*/},
    binary: {downloadDir: './'},
};
const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.set('strictQuery', false);
//const mongoServer = await MongoMemoryServer.create(dbOpts);

export class MongoMemoryDB implements Database {

    mongod: any = null;

    constructor() {
    }

    async init(): Promise<void> {
        console.log("initializing db");
        this.mongod = await MongoMemoryServer.create(dbOpts);
        console.log("db initialized");
    }

    async connect(): Promise<void> {
        const uri = this.mongod.getUri("zbiRepo");
        await mongoose.connect(uri);
        console.log("connected to memory server");
    }

    async close(): Promise<void> {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await this.mongod.stop();

        console.log("closed connection");
    }
    
    async clear(): Promise<void> {
        const collections = mongoose.connection.collections;

        for(const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }
}
