import { Application } from "express";
import beanFactory from "../factory/bean.factory";
import ProjectController from "../controllers/project.controller";
import UserController from "../controllers/user.controller";
import { mainLogger as logger } from "../libs/logger";
import { validator } from "../middlewares/validation.middleware";
import { schemas } from "../model/schema";

export default function (app: Application) {
 
    logger.info("initializing routes");
    const userController: UserController = beanFactory.getController("user");
    const projController: ProjectController = beanFactory.getController("project");
    

    app.route(`/api/account`)
        .all()
        .get(userController.findUser) // get user information
        .post() // confirm account - accept invitation
        .put()    // update account - change password, update profile, reject team, accept team
        .delete() // cancel account - delete account

    app.route(`/api/profile/register`)

    app.route(`/api/users`)
        .all()
        .get(userController.findUsers) // get all users
        .post(userController.createUser) // createnew user

    app.route(`/api/users/:userid`)
        .all()
        .get(userController.findUser) // get user
        .put() // update user - reset password, update user, invite to team, expire invitation
        .delete() // delete user
    
    app.route(`/api/teams`)
        .all()
        .get() // find teams
        .post() // create team

    app.route(`/api/teams/:teamid`)
        .all()
        .get()
        .post() // add new member
        .put() // update membership - add member, remove member
        .patch()
        .delete();

    app.route(`/api/projects`)
        .all()
        .get(projController.findProjects)
        .post(validator(schemas.projectRequest), projController.createProject);

    app.route(`/api/projects/:projectid`)
        .all()
        .get(projController.findProject)
        .put(projController.updateProject)
        .patch(projController.repairProject)
        .delete(projController.deleteProject)
        .purge(projController.purgeProject);

    app.route(`/api/projects/:projectid/resources`)
        .get()
        .put()
        .delete()
        
    app.route(`/api/instances`)
        .all()
        .get(projController.findAllInstances)

    app.route(`/api/projects/:projectid/instances`)
        .all()
        .get(projController.findInstances)
        .post(projController.createInstance)
    
    app.route(`/api/instances/:instanceid`)
        .all()
        .get(projController.findInstance)
        .post(projController.updateInstance)
        .put(projController.operateInstance)
        .patch(projController.repairInstance)
        .delete(projController.deleteInstance)
        .purge(projController.purgeInstance)

    app.route(`/api/instances/:instanceid/resources`)
        .all()
        .get(projController.getInstanceResources)

    app.route(`/api/instances/:instanceid/resources/:resourceid`)
        .all()
        .get(projController.getInstanceResource)
        .put(projController.updateInstanceResource)
        .delete(projController.deleteInstanceResource)
        

}