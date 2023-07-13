import RedisMemoryServer from "redis-memory-server";
import { Database } from "../interfaces";

export class RedisMemoryDB implements Database {
    redis: any = null;

    init(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async connect(): Promise<void> {
        this.redis = new RedisMemoryServer();
    }

    close(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    clear(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}