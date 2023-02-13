import {Request, Response, NextFunction} from 'express';
import context from '../context';
import { mainLogger as logger } from "../logger";
import {v4 as uuidv4} from 'uuid';
import { Constants } from '../constants';
import { request } from 'http';

export const initRequest = (req: Request, res: Response, next: NextFunction) => {

    const store = new Map();  

    let requestid = uuidv4();
    let userid = req.auth && req.auth.payload ? req.auth.payload.sub : "user";

//    req.body.userid = userid;
//    req.body.requestid = requestid;

    return context.run(store, () => {
        const child = logger.child({ requestid, userid });

        store.set(Constants.REQUEST_ID, requestid);
        store.set(Constants.USER_ID, userid);
        store.set('logger', child);
        
        next();
    });
};

//export const 
//jwtValidation
