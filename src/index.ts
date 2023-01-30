import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

import {mainLogger as logger, morganStream} from "./logger";
import beanFactory from "./bean.factory";
import routes from "./routes";
import { initRequest } from "./middlewares/request.middleware";
import { auth0jwtVerifier } from "./middlewares/auth.middleware";

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


app.use(auth0jwtVerifier);
app.use(initRequest);

// app.get('/', (req, res) => {
//     res.send({message: "Hello World!"});
// });

beanFactory.init().then(async () => {
    routes(app);
    app.listen(PORT, async () => {
        logger.info(`Running Node.js version ${process.version}`);
        logger.info(`App environment: ${process.env.NODE_ENV}`);
    
        logger.info(`App is running on port ${PORT}`, `{request: '55'}`);
    });        
}).catch(error => {
    logger.error(`failed to initialize database: ${error}`);
})

