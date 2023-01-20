import {Request, Response} from 'express';
import { IAMService } from '../interfaces';

export default class UserController {

    private iamService: IAMService;

    constructor(iamService: IAMService) {
        this.iamService = iamService;
    }

    async findUsers(request: Request, response: Response): Promise<void> {

        response.end();
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