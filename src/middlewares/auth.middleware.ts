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

export const jwtVerifier = async (req: Request, res: Response, next: NextFunction) => {

    const logger = getLogger("verify-token");
    logger.info(`verifying oauth token`);

    next();
}

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {

    const store = context.getStore();
    const email = store?.get(Constants.USER_EMAIL);

    const logger = getLogger("validate-user");

    try {
        logger.info(`validating user`);
        const userSvc: UserService = beanFactory.getUserService();
        logger.debug(`got user service ... ${JSON.stringify(userSvc)}`);
        const param: QueryParam = {name: UserFilterType.email, condition: FilterConditionType.equal, value: email};
        const user: User = await userSvc.findUser(param)
        logger.debug(`got user: ${JSON.stringify(user)}`);
        store?.set(Constants.USER, user);
        
        if(user.status === UserStatusType.inactive) {
            logger.info(`user ${user.userid} is in-active`);
            res.status(HttpStatusCode.Forbidden).json({message: "Your account is in-active. Contact the system administrator."});
            return;
        } else if( user.status === UserStatusType.invited) {
            // check if this is a registration completion request
            logger.info(`user ${user.userid} has not accepted invitation`);
            if(req.url.startsWith("/api/register")) {
                next();
            } else {
                res.status(HttpStatusCode.FailedDependency).json({message: "Your account is in-active. Contact the system administrator."});
            }

        } else if( user.status === UserStatusType.active ) {
            next();
        }

    } catch(err:any) {
        logger.error(`failed to validate user: ${JSON.stringify(err)}`);        
        res.status(HttpStatusCode.InternalServerError).json({message: err.message});
    }
}