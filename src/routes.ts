import { Application } from "express";
import beanFactory from "./bean.factory";
import UserController from "./controllers/user.controller";
import { logger } from "./logger";

export default function (app: Application) {
 
    logger.info("initializing routes");
    const userController: UserController = beanFactory.getController("user");

    app.get(`/users`, userController.findUsers);
}