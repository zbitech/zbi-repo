import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

import {logger} from "./logger";
//import dbFactory from "./factory/database.factory";
import beanFactory from "./bean.factory";
import routes from "./routes";
import { appendFileSync } from "fs";

if(!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(morgan("combined"));
app.use(helmet());
app.use(cors());
app.use(express.json());

//const db = dbFactory.createDatabase();

app.get('/', (req, res) => {
    res.send({message: "Hello World!"});
});

routes(app);

app.listen(PORT, async () => {
    logger.info(`Running Node.js version ${process.version}`);
    logger.info(`App environment: ${process.env.NODE_ENV}`);

    await beanFactory.init();

    logger.info(`App is running on port ${PORT}`);
});
