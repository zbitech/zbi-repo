import app from "./app";
import {mainLogger as logger, morganStream} from "./libs/logger";
import beanFactory from "./factory/bean.factory";
import routes from "./routes/routes";

const PORT: number = parseInt(process.env.PORT as string, 10);

beanFactory.init().then(async () => {
    routes(app);
    app.listen(PORT, async () => {
        logger.info(`Running Node.js version ${process.version}`);
        logger.info(`App environment: ${process.env.NODE_ENV}`);
    
        logger.info(`App is running on port ${PORT}`, `{request: '55'}`);
    });        
}).catch(error => {
   logger.error(`failed to initialize database: ${error}`);
});
