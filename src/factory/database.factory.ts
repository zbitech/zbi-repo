import { Database } from "../interfaces";
import { MongoDB } from "../services/mongodb/mongodb.service";
import { MongoMemoryDB } from "../services/mongodb/mongodb-mem.service";

import { logger } from "../logger";

const DATABASE = process.env.DATABASE || "mongodb-mem";

class DatabaseFactory {

    createDatabase(): Database {
        const DATABASE = process.env.DATABASE || "mongodb-mem";
        if(DATABASE === "mongodb-mem") {
            logger.info(`initializing mongo memory db`);
            return new MongoMemoryDB();
        } else {
            logger.info(`initializing mongo db`);
            return new MongoDB();
        }
    }

}

export default new DatabaseFactory();