import { Application } from "express";
import beanFactory from "../factory/bean.factory";
import projectController from "../controllers/project.controller";
import userController from "../controllers/user.controller";
import jobController from "../controllers/job.controller";
import { mainLogger as logger } from "../libs/logger";
import { validator } from "../middlewares/validation.middleware";
import { jwtVerifier, validateUser} from "../middlewares/auth.middleware";
import { schemas } from "../model/schema";

export default function (app: Application) {
 
    logger.info("initializing routes");    

    app.route(`/api/oauth/token`)
        .post(userController.authenticateUser);

    app.route(`/api/register`)
        .all(jwtVerifier, validateUser)
        .post(userController.registerUser); // confirm account - accept invitation

    app.route(`/api/account`)
        .all(jwtVerifier, validateUser)
        .get(userController.getAccount) // get user information
        .post(userController.registerUser) // accept or reject team invitation
        .put(userController.updateAccount)    // update account
        .delete(userController.deleteAccount) // cancel account - delete account

    app.route(`/api/account/teams`)
        .all(jwtVerifier, validateUser)
        .get(userController.getMemberships)
        .put()
        .delete()

    app.route(`/api/account/memberships`)
        .all(jwtVerifier, validateUser)
        .get(userController.getMemberships)
        .post(userController.acceptMembership)
        .delete(userController.deleteMembership)

    app.route(`/api/users`)
        .all(jwtVerifier, validateUser)
        .get(userController.findUsers) // get all users
        .post(userController.createUser) // createnew user

    app.route(`/api/users/:userid`)
        .all(jwtVerifier, validateUser)
        .get(userController.findUser) // get user
        .put(userController.updateUser) // update user - reset password, update user, invite to team, expire invitation
        .delete(userController.deleteUser) // delete user
    
    app.route(`/api/teams`)
        .all(jwtVerifier, validateUser)
        .get(userController.findTeams) // find teams

    app.route(`/api/teams/:teamid`)
        .all(jwtVerifier, validateUser)
        .get(userController.findTeam)
        .post(userController.addTeamMember)
        .delete(userController.deleteTeam);

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
        .get(projectController.findAllInstances);

    app.route(`/api/projects/:projectid/instances`)
        .all(jwtVerifier, validateUser)
        .get(projectController.findInstances)
        .post(projectController.createInstance);
    
    app.route(`/api/instances/:instanceid`)
        .all(jwtVerifier, validateUser)
        .get(projectController.findInstance)
        .post(projectController.updateInstance)
        .put(projectController.operateInstance)
        .patch(projectController.repairInstance)
        .delete(projectController.deleteInstance)
        .purge(projectController.purgeInstance);

    app.route(`/api/instances/:instanceid/resources`)
        .all(jwtVerifier, validateUser)
        .get(projectController.getInstanceResources);

    app.route(`/api/instances/:instanceid/resources/:resourceid`)
        .all(jwtVerifier, validateUser)
        .get(projectController.getInstanceResource)
        .put(projectController.updateInstanceResource)
        .delete(projectController.deleteInstanceResource);
        
    app.route(`/api/projects/jobs`)
        .all(jwtVerifier, validateUser)
        .get(jobController.findProjectJobs);

    app.route(`/api/projects/:projectid/jobs`)
        .all(jwtVerifier, validateUser)
        .get(jobController.findProjectJob)
        .patch(jobController.updateProjectJob)
        .delete(jobController.deleteProjectJob);

    app.route(`/api/instances/jobs`)
        .all(jwtVerifier, validateUser)
        .get(jobController.findInstanceJobs);

    app.route(`/api/instances/:instanceid/jobs`)
        .all(jwtVerifier, validateUser)
        .get(jobController.findInstanceJob)
        .patch(jobController.updateInstanceJob)
        .delete(jobController.deleteInstanceJob);
}