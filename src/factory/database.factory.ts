import { Database } from "../interfaces";
import { MongoDB } from "../services/mongodb/mongodb.service";
import { MongoMemoryDB } from "../services/mongodb/mongodb-mem.service";

const DATABASE = process.env.DATABASE || "mongodb-mem";

class DatabaseFactory {

    createDatabase(): Database {
        const DATABASE = process.env.DATABASE || "mongodb-mem";
        if(DATABASE === "mongodb-mem") {
            return new MongoMemoryDB();
        } else {
            return new MongoDB();
        }
    }

}

export default new DatabaseFactory();