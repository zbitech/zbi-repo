import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

import logger from "./logger";
import dbFactory from "./factory/database.factory";


if(!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const db = dbFactory.createDatabase();

app.get('/', (req, res) => {
    res.send({message: "Hello World!"});
});
  
app.listen(PORT, async () => {
    logger.info(`Running Node.js version ${process.version}`);
    logger.info(`App environment: ${process.env.NODE_ENV}`);
    await db.init();
    await db.connect();
    logger.info(`App is running on port ${PORT}`);
});
