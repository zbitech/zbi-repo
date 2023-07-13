import axios, { HttpStatusCode } from "axios";
import { AuthRequest, AuthResult, QueryParam, RegisterRequest, RegisterResult, User, UserInfo } from "../model/model";
import { ServiceError } from "../libs/errors";
import { IdentityService, UserRepository } from "../interfaces";
import { getLogger } from "../libs/logger";
import beanFactory from "../factory/bean.factory";

class BasicIdentityService implements IdentityService {

    async authenticateUser(request: AuthRequest): Promise<AuthResult> {

        const logger = getLogger("authenticate-user");
        try {
            const repository = beanFactory.getUserRepository();
            const email = request.email as string;
            const password = request.password as string;

            const user = await repository.validatePassword(email, password);
            logger.debug(`found user: ${JSON.stringify(user)}`);
            if(!user) {
                return {valid: false, registered: false};
            }

            return {email, valid: true, registered: true, user};
        } catch (e: any) {
            throw e;            
        }

    }
}

export default new BasicIdentityService();