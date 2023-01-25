import {Request, Response} from 'express';
import { IAMService } from '../interfaces';

import { getLogger } from "../logger";

export default class UserController {

    private iamService: IAMService;

    constructor(iamService: IAMService) {
        this.iamService = iamService;
    }

    async findUsers(request: Request, response: Response): Promise<void> {

        let logger = getLogger('uc');
        try {
            const users = await this.iamService.findUsers(10, 1);
            response.json(users);
        } catch(err:any) {
            response.status(500).json({message: err.message});
        } finally {
            
        }

    }

    async inviteUser(request: Request, response: Response): Promise<void> {

    }

    async findUser(request: Request, response: Response): Promise<void> {

    }

    async deactivateUser(request: Request, response: Response): Promise<void> {

    }

    async reactivateUser(request: Request, response: Response): Promise<void> {

    }

    async deleteUser(request: Request, response: Response): Promise<void> {

    }

}