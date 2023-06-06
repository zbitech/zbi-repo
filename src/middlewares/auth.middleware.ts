import { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { getLogger } from '../libs/logger';
import beanFactory from '../factory/bean.factory';
import context from "../libs/context";
import { Constants } from '../constants';
import { UserService } from '../interfaces';
import { QueryParam, User } from '../model/model';
import { FilterConditionType, UserFilterType, UserStatusType } from '../model/zbi.enum';
import { HttpStatusCode } from 'axios';
import { get } from "lodash";
import { verifyJwtAccessToken } from '../libs/auth.libs';


export const validateAccessToken = async (req: Request, res: Response, next: NextFunction) => {

    const logger = getLogger("validate-token");

    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "");
    logger.debug(`validating token => ${accessToken}`);

    if(accessToken) {
        const result = verifyJwtAccessToken(accessToken);

        logger.debug(`Token Verification Result = ${JSON.stringify(result)}`);
        if(result.subject) {
            res.locals.subject = result.subject;
            console.info(`user token is valid`);
            next();
        } else {
            res.status(HttpStatusCode.Forbidden).json({message: "User is not recognized. Contact the system administrator."});
            return;
        }
    } else {
        res.status(HttpStatusCode.Unauthorized).json({message: "You are not authorized to access this resource. Contact the system administrator."});
    }

}

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {

    const store = context.getStore();
    const email = store?.get(Constants.USER_EMAIL);

    const logger = getLogger("validate-user");

    try {
        const subject = res.locals.subject;
        
        console.debug(`validating subject: ${JSON.stringify(subject)}`);
        store?.set(Constants.USER, subject);
        
        if(subject.status === UserStatusType.inactive) {
            logger.info(`user ${subject.name} is in-active`);
            res.status(HttpStatusCode.Forbidden).json({message: "Your account is currently inactive. Contact the system administrator."});
            return;
        } else if( subject.status === UserStatusType.invited) {
            // check if this is a registration completion request
            logger.info(`user ${subject.userid} has not accepted invitation`);
            if(req.url.startsWith("/api/register")) {
                next();
            } else {
                res.status(HttpStatusCode.FailedDependency).json({message: "Your account registration is not yet completed. Contact the system administrator."});
            }
        } else if( subject.status === UserStatusType.active ) {
            next();
        } else {
            res.status(HttpStatusCode.Forbidden).json({message: "User is forbidden to access resource. Contact the system administrator"})
        }
    } catch(err:any) {
        logger.error(`failed to validate user: ${JSON.stringify(err)}`);        
        res.status(HttpStatusCode.InternalServerError).json({message: err.message});
    }
}