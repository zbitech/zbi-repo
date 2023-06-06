
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

import {mainLogger as logger, morganStream} from "./libs/logger";
import { initRequest } from "./middlewares/request.middleware";
//import { jwtVerifier } from "./middlewares/auth.middleware";

if(!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(morgan(":method :url :status :res[content-length] - :response-time ms", {stream: morganStream}));
//app.use(morganMiddleware);
app.use(helmet());
app.use(cors());
app.use(express.json());


//app.use(jwtVerifier);
app.use(initRequest);

export default app;