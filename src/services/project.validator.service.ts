import beanFactory from "../factory/bean.factory";
import { Instance, InstanceRequest, Project, ProjectRequest, User } from "../model/model";
import { FilterConditionType, InstanceFilterType, ProjectFilterType, RoleType } from "../model/zbi.enum";
import { ResourcePermissionError, ResourceQuotaExceededError } from "../libs/errors";
import { getLogger } from "../libs/logger";

class ProjectValidatorService {

    async validateProjectRequest(user: User, project: ProjectRequest) {
        const logger = getLogger('validate-project-request');
        try {
            
            if(user.role != RoleType.owner) {
                throw new ResourcePermissionError("You do not have permission to create project");
            }

            const repo = beanFactory.getProjectRepository();
            const param = {name: ProjectFilterType.owner, condition: FilterConditionType.equal, value: user.userid};
            const projects = await repo.findProjects(param);

            if(projects && projects.length >= 1) {
                throw new ResourceQuotaExceededError("You have exceeded your limit for projects");                
            }


        } catch (err: any) {
            logger.error(err);
            throw err;
        }

    }

    async validateRepairProject(user: User, project: Project) {
        const logger = getLogger('validate-repair-project');
        try {

            if(user.userid != project.owner.userid && user.role != RoleType.admin) {
                throw new ResourcePermissionError("You do not have permission to create project");
            }
            
        } catch (err: any) {
            
        }
    }

    async validateInstanceRequest(user: User, project: Project, instance: InstanceRequest) {
        const logger = getLogger('validate-instance-request');
        try {

            if(user.role != RoleType.owner) {
                throw new ResourcePermissionError("You do not have permission to create project");
            }

            const repo = beanFactory.getProjectRepository();
            const param = {name: ProjectFilterType.owner, condition: FilterConditionType.equal, value: user.userid};
            const projects = await repo.findProjects(param);

            const instances = projects.map(project =>async (project:Project) => {
                const param = {name: InstanceFilterType.project, condition: FilterConditionType.equal, value: project.id};                
                return await repo.findInstances(param);
            })

            if(instances && instances.length >= 2) {
                throw new ResourceQuotaExceededError("You have exceeded your limit for instances");
            }

            
        } catch (err: any) {
            logger.error(err);
            throw err;            
        }
    }

    async validateInstanceUpdate(user: User, project: Project, instance: Instance, instanceRequest: InstanceRequest) {
        const logger = getLogger('validate-instance-update');
        try {

            if(user.role != RoleType.owner && user.role != RoleType.admin) {
                throw new ResourcePermissionError("You do not have permission to create project");
            }
            
        } catch (err: any) {
            logger.error(err);
            throw err;            
        }
    }

    async validateStartInstance(user: User, project: Project, instance: Instance, instanceRequest: InstanceRequest) {
        const logger = getLogger('validate-start-instance');
        try {

            if(user.role != RoleType.owner && user.role != RoleType.admin) {
                throw new ResourcePermissionError("You do not have permission to create project");
            }
            
        } catch (err: any) {
            logger.error(err);
            throw err;            
        }
    }

    async validateStopInstance(user: User, project: Project, instance: Instance, instanceRequest: InstanceRequest) {
        const logger = getLogger('validate-stop-instance');
        try {

            if(user.role != RoleType.owner && user.role != RoleType.admin) {
                throw new ResourcePermissionError("You do not have permission to create project");
            }
            
        } catch (err: any) {
            logger.error(err);
            throw err;            
        }
    }

    async validateRotateInstance(user: User, project: Project, instance: Instance, instanceRequest: InstanceRequest) {
        const logger = getLogger('validate-rotate-instance');
        try {

            if(user.role != RoleType.owner && user.role != RoleType.admin) {
                throw new ResourcePermissionError("You do not have permission to create project");
            }
            
        } catch (err: any) {
            logger.error(err);
            throw err;            
        }
    }

    async validateInstanceSnapshotRequest(user: User, instance: Instance) {
        const logger = getLogger('validate-instance-snapshot');
        try {

            if(user.role != RoleType.owner && user.role != RoleType.admin) {
                throw new ResourcePermissionError("You do not have permission to create project");
            }
            
        } catch (err: any) {
            logger.error(err);
            throw err;            
        }
    }

    async validateInstanceSnapshotScheduleRequest(user: User, instance: Instance) {
        const logger = getLogger('validate-instance-schedule');
        try {
            if(user.role != RoleType.owner && user.role != RoleType.admin) {
                throw new ResourcePermissionError("You do not have permission to create project");
            }            
        } catch (err: any) {
            logger.error(err);
            throw err;            
        }
    }
}

export default new ProjectValidatorService();