import { Database } from "./services.interface";
import { MongoDB } from "./mongodb/mongodb.service";
import { MongoMemoryDB } from "./mongodb/mongodb-mem.service";

const DATABASE = process.env.DATABASE || "mongodb";

class ServiceFactory {

    private database: Database;

    public constructor() {
        if(DATABASE === "mongodb-mem") {
            this.database = new MongoMemoryDB();
        } else {
            this.database = new MongoDB();
        }
    }

    public getDatabase(): Database {
        return this.database;
    }
}

export default new ServiceFactory();