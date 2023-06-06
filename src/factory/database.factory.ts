import { Database } from "../interfaces";
import { MongoDB } from "../services/mongodb.service";
import { MongoMemoryDB } from "../services/mongodb-mem.service";
import { mainLogger as logger } from "../libs/logger";

const DATABASE = process.env.DATABASE || "mongodb-mem";

class DatabaseFactory {

    createDatabase(): Database {        
        const DATABASE = process.env.DATABASE || "mongodb-mem";
        logger.info(`initializing database - ${DATABASE}`);
        if(DATABASE === "mongodb-mem") {
            return new MongoMemoryDB();
        } else {
            return new MongoDB();
        }
    }

}

export default new DatabaseFactory();