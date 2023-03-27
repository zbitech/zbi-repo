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

const TENANT_ID = process.env.AUTH0_TENANT_ID;
const DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET
const AUDIENCE = process.env.AUTH0_AUDIENCE

export const jwtVerifier = beanFactory.getIdentityService().getAccessVerifier();

export const validateUser = async (req: Request, res: Response, next: NextFunction) => {

    const store = context.getStore();
    const userid = store?.get(Constants.USER_ID);

    const logger = getLogger("validate-user");

    try {
        const userSvc: UserService = beanFactory.getUserService();
        const param: QueryParam = {name: UserFilterType.userid, condition: FilterConditionType.equal, value: userid};
        const user: User = await userSvc.findUser(param)

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

        res.status(HttpStatusCode.InternalServerError).json({message: err.message});
    }
}