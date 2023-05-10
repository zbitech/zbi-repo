import axios, { HttpStatusCode } from "axios";
import { AuthRequest, AuthResult, QueryParam, RegisterRequest, RegisterResult, User } from "../model/model";
import { ServiceError, ServiceErrorType } from "../libs/errors";
import { IdentityService, UserRepository } from "../interfaces";
import { Handler } from "express";
import { auth } from 'express-oauth2-jwt-bearer';
import { getLogger } from "../libs/logger";
import { Request, Response } from "express";
import  config from "config";
import qs from "qs";
import { FilterConditionType, RoleType, UserFilterType, UserStatusType } from "src/model/zbi.enum";
import { signJwt } from "src/libs/auth.libs";

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

export default class GoogleIdentityService implements IdentityService {

    token: string = "";
    expiration: number = 3600;

    private repository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.repository = userRepository;
    }

    // async createUser(email: string, name: string, role: RoleType, status: UserStatusType): Promise<User> {

    //     try {
    //         return await this.repository.createUser(email, name, role, status);
    //     } catch(err) {
    //         throw err;
    //     }
    // }

    // async updateUser(email: string, name: string, status: UserStatusType): Promise<User> {
    //     try {
    //         return await this.repository.updateUser(email, name, status);
    //     } catch(err) {
    //         throw err;
    //     }
    // }

    // async getUserById(userid: string): Promise<User> {
    //     const param: QueryParam = {name: UserFilterType.userid, condition: FilterConditionType.equal, value: userid};
    //     const user: User = await this.repository.findUser(param);

    //     return user;
    // }

    // async getUserByEmail(email: string): Promise<User> {
    //     const param: QueryParam = {name: UserFilterType.email, condition: FilterConditionType.equal, value: email};
    //     const user: User = await this.repository.findUser(param);

    //     return user;
    // }

    // async setPassword(email: string, password: string): Promise<void> {
    //     throw new Error("method not implemented");
    // }

    // async resetPassword(userid: string): Promise<void> {
    //     throw new Error("method not implemented");
    // }

    // async deactivateUser(userid: string): Promise<void> {
    //     try {
    //         await this.repository.deactivateUser(userid);
    //     } catch(err) {
    //         throw err;
    //     }
    // }

    // async activateUser(userid: string): Promise<void> {
    //     try {
    //         await this.repository.activateUser(userid);
    //     } catch(err) {
    //         throw err;
    //     }
    // }

    // async deleteUser(userid: string): Promise<void> {
    //     try {
    //         await this.repository.deleteUser(userid);
    //     } catch(err) {
    //         throw err;
    //     }
    // }

    // async getAccountActivity(userid: string): Promise<void> {
    //     try {
    //         const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
    //         const response = await axios.get(`${AUTH0_URL}/api/v2/users/${userid}/logs`, {headers});

    //         if(response.status === HttpStatusCode.Ok) {
    //             // retrieve activity logs - TODO

    //             return
    //         }

    //         throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

    //     } catch(err) {
    //         throw err;
    //     }

    // }

    // getLoginURL(): string {
    //     return "";
    // }

    // getAccessVerifier(): Handler {
    //     return auth({
    //         audience: `${AUDIENCE}`,
    //         issuerBaseURL: `https://${TENANT_ID}.${DOMAIN}/`,
    //         tokenSigningAlg: 'RS256',
    //         jwksUri: `https://${TENANT_ID}.${DOMAIN}/.well-known/jwks.json`
    //     });
    // }

    async authenticateUser(request: AuthRequest): Promise<AuthResult> {
        try {

            // generate token
            const code: string = request.code as string;
            const { id_token, access_token } = await getGoogleOAuthTokens(code);
            const guser = await getGoogleUser(id_token, access_token);

            // find user
            let user = await this.repository.getUserByEmail(guser.email);
            if(user) {
                user = await this.repository.updateUser(guser.email, guser.name, UserStatusType.active);
                return {email: guser.email, valid: true, registered: false, user};
            } else {
                return {valid: false, registered: false};
            }
        } catch (e: any) {
            throw e;            
        }

    }

    // async registerUser(user: RegisterRequest): Promise<RegisterResult> {
    //     try {


    //         // generate token
    //         return {};
    //     } catch (e: any) {
    //         throw e;            
    //     }

    // }

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