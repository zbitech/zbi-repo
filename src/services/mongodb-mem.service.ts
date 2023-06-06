import { Database } from "../interfaces";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { mainLogger as logger } from "../libs/logger";
import { LoginProvider, RoleType, UserStatusType } from "../model/zbi.enum";
import { hashPassword } from "../libs/auth.libs";
import config from "config";
import model from "../repositories/mongodb/mongo.model";

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
        logger.info(`initializing mongo memory db`);
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
        
        // const email = config.get<string>("adminEmail");
        // const pass = config.get<string>("adminPassword");
        // const password = await hashPassword(pass);
        // logger.debug(`creating - email -> ${email} password -> ${pass} [${password}]`);
        
        // const uc = model.userModel({email, password: password, role: RoleType.admin, status: UserStatusType.active, registration: {acceptedTerms: true, provider: LoginProvider.local}});
        // await uc.save();
        // logger.info(`created admin user - ${email}`);
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
