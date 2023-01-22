import { Application } from "express";
import beanFactory from "./bean.factory";
import ProjectController from "./controllers/project.controller";
import UserController from "./controllers/user.controller";
import { logger } from "./logger";

export default function (app: Application) {
 
    logger.info("initializing routes");
    const userController: UserController = beanFactory.getController("user");
    const projController: ProjectController = beanFactory.getController("project");

    app.route(`/users`)
        .all()
        .get(userController.findUsers) // get all users
        .post() // new user

    app.route(`/users/:userid`)
        .all()
        .get() // get user
        .put() // update user
        .delete() // delete user
    
    app.route(`/teams`)
        .all()
        .get()
        .post()

    app.route(`/teams/:teamid`)
        .all()
        .get()
        .post() // add new member
        .put()
        .patch()
        .delete();

    app.route(`/projects`)
        .all()
        .get(projController.findProjects)
        .post(projController.createProject);

    app.route(`/projects/:projectid`)
        .all()
        .get(projController.findProject)
        .put(projController.updateProject)
        .patch(projController.repairProject)
        .delete(projController.deleteProject)
        .purge(projController.purgeProject);

    app.route(`/projects/:projectid/resources`)
        .get()
        .put()
        .delete()
        
    app.route(`/instances`)
        .all()
        .get(projController.findAllInstances)

    app.route(`/projects/:projectid/instances`)
        .all()
        .get(projController.findInstances)
        .post(projController.createInstance)
    
    app.route(`/instances/:instanceid`)
        .all()
        .get(projController.findInstance)
        .post(projController.updateInstance)
        .put(projController.operateInstance)
        .patch(projController.repairInstance)
        .delete(projController.deleteInstance)
        .purge(projController.purgeInstance)

    app.route(`/instances/:instanceid/resources`)
        .all()
        .get(projController.getInstanceResources)

    app.route(`/instances/:instanceid/resources/:resourceid`)
        .all()
        .get(projController.getInstanceResource)
        .put(projController.updateInstanceResource)
        .delete(projController.deleteInstanceResource)
        

}