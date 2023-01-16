import { Database } from "../services.interface";

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

export class MongoMemoryDB implements Database {

    async connect(): Promise<void> {
        const uri = await mongod.getConnectionString();
        const mongooseOpts = {
            useNewUrlParser: true, autoReconnect: true,
            reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000
        }

        await mongoose.connect(uri, mongooseOpts);
    }

    async close(): Promise<void> {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongod.stop();
    }
    
    async clear(): Promise<void> {
        const collections = mongoose.connection.collections;

        for(const key in collections) {
            const collection = collections[key];
            await collection.deleteMany();
        }
    }
    
    getDatabase() {
        return mongoose;
    }
}
