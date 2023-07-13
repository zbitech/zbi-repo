import { Application } from "express";
import beanFactory from "../factory/bean.factory";
import projectController from "../controllers/project.controller";
import userController from "../controllers/user.controller";
import jobController from "../controllers/job.controller";
import { mainLogger as logger } from "../libs/logger";
import { validateDuplicateEmail, validateRequest } from "../middlewares/validation.middleware";
import { validateAccessToken, validateUser} from "../middlewares/auth.middleware";
import { schemas } from "../model/schema";
import { validateUserPermission } from "../middlewares/permission.middleware";
import { Action, Permission } from "../model/zbi.enum";

export default function (app: Application) {
 
    logger.info("initializing routes");    

    app.route(`/api/oauth/:provider(local|google)`)
        .all(validateRequest(schemas.localAuthRequest))
        .post(userController.authenticateUser);

    app.route(`/api/register/local`)
        .post(validateRequest(schemas.registerLocalRequest),  userController.registerLocalUser);

    app.route(`/api/register/:provider(google)`)
        .all(validateAccessToken)
        .post(validateRequest(schemas.registerExternalRequest), userController.registerExternalUser);

    app.route(`/api/users`)
        .all(validateAccessToken, validateUser)
        .get(validateRequest(schemas.findUsersRequest), userController.findUsers)
        .post(validateRequest(schemas.inviteResourceOwner), validateUserPermission(Permission.create), validateDuplicateEmail, userController.inviteResourceOwner) // validate permission

    app.route(`/api/users/:userid`)
        .all(validateAccessToken, validateUser)
        .get(validateRequest(schemas.findUserRequest), validateUserPermission(Permission.read), userController.findUser)
        .put(userController.updateUser)
        .delete(userController.deleteUser)

    app.route(`/api/users/:userid/deactivate`)
        .all(validateAccessToken, validateUser)
        .get(validateUserPermission(Permission.delete), userController.deactivateUser)

    app.route(`/api/users/:userid/activate`)
        .all(validateAccessToken, validateUser)
        .get(validateUserPermission(Permission.create), userController.reactivateUser)

    app.route(`/api/account`)
        .all(validateAccessToken, validateUser)
        .get(userController.getAccount) // get user information
        .put(userController.updateAccount)    // update account
        .delete(userController.deleteAccount) // cancel account - delete account

    app.route(`/api/account/changepassword`)
        .all(validateAccessToken, validateUser)
        .get(validateRequest(schemas.changePasswordRequest), userController.changePassword) // get user information

    app.route(`/api/account/teams`)
        .all(validateAccessToken, validateUser)
        .get(userController.getMyTeam)
        .put()
        .delete()

    app.route(`/api/account/memberships`)
        .all(validateAccessToken, validateUser)
        .get(userController.getMemberships)
        .post(userController.acceptMembership)
        .delete(userController.deleteMembership)

    
    app.route(`/api/teams`)
        .all(validateAccessToken, validateUser)
        .get(userController.findTeams) // find teams

    app.route(`/api/teams/:teamid`)
        .all(validateAccessToken, validateUser)
        .get(userController.findTeam)
        .post(userController.addTeamMember)
        .delete(userController.deleteTeam);

    app.route(`/api/projects`)
        .all(validateAccessToken, validateUser)
        .get(projectController.findProjects)
        .post(validateRequest(schemas.projectRequest), projectController.createProject);

    app.route(`/api/projects/:project`)
        .all(validateAccessToken, validateUser)
        .get(projectController.findProject)
        .put(projectController.updateProject)
        .patch(projectController.repairProject)
        .delete(projectController.deleteProject)
        .purge(projectController.purgeProject);

    app.route(`/api/projects/:project/resources`)
        .all(validateAccessToken, validateUser)
        .get()
        .put()
        .delete()
        
    app.route(`/api/instances`)
        .all(validateAccessToken, validateUser)
        .get(projectController.findAllInstances);

    app.route(`/api/projects/:project/instances`)
        .all(validateAccessToken, validateUser)
        .get(projectController.findInstances)
        .post(validateRequest(schemas.instanceRequest), projectController.createInstance);
    
    app.route(`/api/projects/:project/instances/:instance`)
        .all(validateAccessToken, validateUser)
        .get(projectController.findInstance)
        .post(projectController.updateInstance)
        .put(projectController.operateInstance)
        .patch(projectController.repairInstance)
        .delete(projectController.deleteInstance)
        .purge(projectController.purgeInstance);

    app.route(`/api/projects/:project/instances/:instance/resources`)
        .get(validateAccessToken, validateUser, projectController.getInstanceResources)
        .put(projectController.updateInstanceResource)
        .delete(validateAccessToken, validateUser, projectController.deleteInstanceResource);
        
    app.route(`/api/projects/jobs`)
        .all(validateAccessToken, validateUser)
        .get(jobController.findProjectJobs);

    app.route(`/api/projects/:projectid/jobs`)
        .all(validateAccessToken, validateUser)
        .get(jobController.findProjectJob)
        .patch(jobController.updateProjectJob)
        .delete(jobController.deleteProjectJob);

    app.route(`/api/instances/jobs`)
        .all(validateAccessToken, validateUser)
        .get(jobController.findInstanceJobs);

    app.route(`/api/instances/:instanceid/jobs`)
        .all(validateAccessToken, validateUser)
        .get(jobController.findInstanceJob)
        .patch(jobController.updateInstanceJob)
        .delete(jobController.deleteInstanceJob);
}