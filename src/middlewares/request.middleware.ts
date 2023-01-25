import {Request, Response, NextFunction} from 'express';
import context from '../context';
import { mainLogger as logger } from "../logger";
import {v4 as uuidv4} from 'uuid';
import { Constants } from '../constants';

export const initRequest = (req: Request, res: Response, next: NextFunction) => {

    const store = new Map();  

    let requestid = uuidv4();
    let userid = "user";

//    ({requestId: uuidv4(), user: "zbi", service: "main"})
    return context.run(store, () => {
        const child = logger.child({ requestid, userid });
        child.info("created child logger");
        store.set(Constants.REQUEST_ID, requestid);
        store.set(Constants.USER_ID, userid);
        store.set('logger', child);
        
        next();
    });
};