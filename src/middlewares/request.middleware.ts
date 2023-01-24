import {Request, Response, NextFunction} from 'express';
import context from '../context';
import { logger } from "../logger";
import {v4 as uuidv4} from 'uuid';
import { Constants } from '../constants';

export const initRequest = (req: Request, res: Response, next: NextFunction) => {

    const store = new Map();  

    let requestId = uuidv4();
    let user = "user";

 //   const child = logger.child({ requestId, user });

    store.set(Constants.REQUEST_ID, requestId);
    store.set(Constants.USER_ID, user);
 //   store.set('logger', child);

    return context.run(store, () => {

        next();
    });
};