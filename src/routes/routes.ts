import { Application } from "express";
import beanFactory from "../factory/bean.factory";
import projectController from "../controllers/project.controller";
import userController from "../controllers/user.controller";
import { mainLogger as logger } from "../libs/logger";
import { validator } from "../middlewares/validation.middleware";
import { schemas } from "../model/schema";

export default function (app: Application) {
 
    logger.info("initializing routes");    

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
        .get(projectController.findProjects)
        .post(validator(schemas.projectRequest), projectController.createProject);

    app.route(`/api/projects/:projectid`)
        .all()
        .get(projectController.findProject)
        .put(projectController.updateProject)
        .patch(projectController.repairProject)
        .delete(projectController.deleteProject)
        .purge(projectController.purgeProject);

    app.route(`/api/projects/:projectid/resources`)
        .get()
        .put()
        .delete()
        
    app.route(`/api/instances`)
        .all()
        .get(projectController.findAllInstances)

    app.route(`/api/projects/:projectid/instances`)
        .all()
        .get(projectController.findInstances)
        .post(projectController.createInstance)
    
    app.route(`/api/instances/:instanceid`)
        .all()
        .get(projectController.findInstance)
        .post(projectController.updateInstance)
        .put(projectController.operateInstance)
        .patch(projectController.repairInstance)
        .delete(projectController.deleteInstance)
        .purge(projectController.purgeInstance)

    app.route(`/api/instances/:instanceid/resources`)
        .all()
        .get(projectController.getInstanceResources)

    app.route(`/api/instances/:instanceid/resources/:resourceid`)
        .all()
        .get(projectController.getInstanceResource)
        .put(projectController.updateInstanceResource)
        .delete(projectController.deleteInstanceResource)
        

}