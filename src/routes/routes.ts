import { Application } from "express";
import beanFactory from "../factory/bean.factory";
import projectController from "../controllers/project.controller";
import userController from "../controllers/user.controller";
import { mainLogger as logger } from "../libs/logger";
import { validator } from "../middlewares/validation.middleware";
import { jwtVerifier, validateUser} from "../middlewares/auth.middleware";
import { schemas } from "../model/schema";

export default function (app: Application) {
 
    logger.info("initializing routes");    

    app.route(`/oauth/token`)
        .post();

    app.route(`/api/register`)
        .all(jwtVerifier, validateUser)
        .post(userController.registerUser); // confirm account - accept invitation

    app.route(`/api/account`)
        .all(jwtVerifier, validateUser)
        .get(userController.getAccount) // get user information
        .post(userController.registerUser) // accept or reject team invitation
        .put(userController.updateAccount)    // update account
        .delete() // cancel account - delete account

    app.route(`/api/account/teams`)
        .all(jwtVerifier, validateUser)
        .get()
        .post()
        .put()
        .delete()

    app.route(`/api/users`)
        .all(jwtVerifier, validateUser)
        .get(userController.findUsers) // get all users
        .post(userController.createUser) // createnew user

    app.route(`/api/users/:userid`)
        .all(jwtVerifier, validateUser)
        .get(userController.findUser) // get user
        .put() // update user - reset password, update user, invite to team, expire invitation
        .delete() // delete user
    
    app.route(`/api/teams`)
        .all(jwtVerifier, validateUser)
        .get() // find teams
        .post() // create team

    app.route(`/api/teams/:teamid`)
        .all(jwtVerifier, validateUser)
        .get()
        .post() // add new member
        .put() // update membership - add member, remove member
        .patch()
        .delete();

    app.route(`/api/projects`)
        .all(jwtVerifier, validateUser)
        .get(projectController.findProjects)
        .post(validator(schemas.projectRequest), projectController.createProject);

    app.route(`/api/projects/:projectid`)
        .all(jwtVerifier, validateUser)
        .get(projectController.findProject)
        .put(projectController.updateProject)
        .patch(projectController.repairProject)
        .delete(projectController.deleteProject)
        .purge(projectController.purgeProject);

    app.route(`/api/projects/:projectid/resources`)
        .all(jwtVerifier, validateUser)
        .get()
        .put()
        .delete()
        
    app.route(`/api/instances`)
        .all(jwtVerifier, validateUser)
        .get(projectController.findAllInstances)

    app.route(`/api/projects/:projectid/instances`)
        .all(jwtVerifier, validateUser)
        .get(projectController.findInstances)
        .post(projectController.createInstance)
    
    app.route(`/api/instances/:instanceid`)
        .all(jwtVerifier, validateUser)
        .get(projectController.findInstance)
        .post(projectController.updateInstance)
        .put(projectController.operateInstance)
        .patch(projectController.repairInstance)
        .delete(projectController.deleteInstance)
        .purge(projectController.purgeInstance)

    app.route(`/api/instances/:instanceid/resources`)
        .all(jwtVerifier, validateUser)
        .get(projectController.getInstanceResources)

    app.route(`/api/instances/:instanceid/resources/:resourceid`)
        .all(jwtVerifier, validateUser)
        .get(projectController.getInstanceResource)
        .put(projectController.updateInstanceResource)
        .delete(projectController.deleteInstanceResource)
        

}