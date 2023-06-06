import { User } from "../model/model";
import { Action, RoleType, Permission } from "../model/zbi.enum";
import { IAccessService } from "../interfaces";


class AccessService implements IAccessService {

    async validateUserPermission(user: User, permission: Permission): Promise<boolean> {
        return user.role === RoleType.admin;
    }

    async validateTeamPermission(user: User, permission: Permission): Promise<boolean> {
        return user.role === RoleType.admin;
    }

    async validateProjectPermission(user: User, permission: Permission): Promise<boolean> {

        switch (permission) {
            case Permission.create:
                return user.role === RoleType.admin || user.role === RoleType.owner;
        
            case Permission.read:
                break;

            case Permission.delete:
                break;

            case Permission.update:
                break;

            default: return false;
        }

        return true;
    }

    async validateInstancePermission(user: User, permission: Permission): Promise<boolean> {

        return true;
    }

    async validateResourcePermission(user: User, permission: Permission): Promise<boolean> {

        return true;
    }

}

export default new AccessService();
