import axios, { HttpStatusCode } from "axios";
import { AuthRequest, AuthResult, QueryParam, RegisterRequest, RegisterResult, User } from "../model/model";
import { ServiceError } from "../libs/errors";
import { IdentityService, UserRepository } from "../interfaces";
import { Handler } from "express";
import { auth } from 'express-oauth2-jwt-bearer';
import { getLogger } from "../libs/logger";
import { Request, Response } from "express";
import  config from "config";
import qs from "qs";
import { FilterConditionType, RoleType, UserFilterType, UserStatusType } from "../model/zbi.enum";
import { signJwt } from "../libs/auth.libs";
import beanFactory from "../factory/bean.factory";

const TENANT_ID = process.env.AUTH0_TENANT_ID;
const DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET
const AUDIENCE = process.env.AUTH0_AUDIENCE
const CONNECTION_ID =  process.env.AUTH0_CONNECTION_ID;
const CONNECTION = process.env.AUTH0_CONNECTION || "Username-Password-Authentication";

const AUTH0_URL=`https://${TENANT_ID}.${DOMAIN}`

interface GoogleTokenResult {
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
}

interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}
class GoogleIdentityService implements IdentityService {

    token: string = "";
    expiration: number = 3600;

    async authenticateUser(request: AuthRequest): Promise<AuthResult> {
        try {

            const repository = beanFactory.getUserRepository();

            // generate token
            const code: string = request.code as string;
            const { id_token, access_token } = await getGoogleOAuthTokens(code);
            const guser = await getGoogleUser(id_token, access_token);

            // find user
            let user = await repository.getUserByEmail(guser.email);
            if(user) {
                user = await repository.updateUser(guser.email, guser.name, UserStatusType.active);
                return {email: guser.email, valid: true, registered: false, user};
            } else {
                return {valid: false, registered: false};
            }
        } catch (e: any) {
            throw e;            
        }

    }
}

async function getGoogleOAuthTokens(code: string): Promise<GoogleTokenResult> {
    const logger = getLogger("google-token");
    const url = "https://oauth2.googleapis.com/token";
    const values = {code, client_id: config.get("googleClientId"), client_secret: config.get("googleClientSecret"),
                    grant_type: "authorization_code", redirect_uri: config.get("googleOauthRedirectUrl")};
    try {
        const res = await axios.post<GoogleTokenResult>(url, qs.stringify(values), {
            headers: {"Content-Type": "application/x-www-form-urlencoded"}
        });

        return res.data;
    } catch (err: any) {
        throw err;
    }
}

async function getGoogleUser(id_token: string, access_token: string): Promise<GoogleUserResult> {
    const logger = getLogger("google-user");

    try {
        const res = await axios.get<GoogleUserResult>(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers: {Authorization: `Bearer: ${id_token}`}
        });
        return res.data;
    } catch (err: any) {
        throw err;
    }
}

export default new GoogleIdentityService();