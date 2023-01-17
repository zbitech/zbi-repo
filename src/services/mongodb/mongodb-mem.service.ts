import { Database } from "../services.interface";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

export class MongoMemoryDB implements Database {

    mongod: any = null;

    constructor() {
    }

    async connect(): Promise<void> {

        this.mongod = await MongoMemoryServer.create();
        const uri = this.mongod.getUri();

        const mongooseOpts = {
            useNewUrlParser: true, autoReconnect: true,
            reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000
        }

        mongoose.connect(uri, () => {
            console.log("connected to memory server");
        });
    }

    async close(): Promise<void> {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await this.mongod.stop();
    }
    
    async clear(): Promise<void> {
        const collections = mongoose.connection.collections;

        for(const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }
    
    getDatabase() {
        return mongoose;
    }
}
