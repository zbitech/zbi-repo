import axios, { HttpStatusCode } from "axios";
import { User, UserInfo } from "../../model/model";
import { AuthenticationClient, ManagementClient } from 'auth0';
import { ServiceError, ServiceErrorType } from "../../libs/errors";
import { IdentityService } from "../../interfaces";
import { Handler } from "express";
import { auth } from 'express-oauth2-jwt-bearer';

const AUTH0_TENANT_ID = process.env.AUTH0_TENANT_ID;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_GRANT_TYPE = process.env.AUTH0_GRANT_TYPE;

const TENANT_ID = process.env.AUTH0_TENANT_ID;
const DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET
const AUDIENCE = process.env.AUTH0_AUDIENCE


const AUTH0_URL=`https://${TENANT_ID}.${DOMAIN}`

var auth0 = new AuthenticationClient({domain: `${AUTH0_TENANT_ID}.${AUTH0_DOMAIN}`, clientId: AUTH0_CLIENT_ID})

var management = new ManagementClient({
    token: '', domain: ''
})

class Auth0IdentityService implements IdentityService {

    token: string = "";
    expiration: number = 3600;

    constructor() {
        this.getToken();
        this.expiration = 3600;

        this.getToken();
    }


    async createUser(user: User): Promise<UserInfo> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const user_data = {
                "email": user.email,
                "email_verified": false,
                "verify_email": false,
                "name": user.name,
            };

            // invite user
            const user_response = await axios.post(`${AUTH0_URL}/api/v2/users`, JSON.stringify(user_data), {headers});
            if(user_response.status == HttpStatusCode.Created) {
                user.userId = user_response.data.user_id;
                const role_data = {"roles":[user.role]}

                // set user role
                const role_response = await axios.post(`${AUTH0_URL}/api/v2/users/${user_response.data.user_id}/roles`, JSON.stringify(role_data), {headers});
            }

            throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

        } catch(err) {
            throw err;
        }
    }

    async updateUser(user: User): Promise<UserInfo> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const user_data = {
                "email": user.email,
                "name": user.name,
            };

            const user_response = await axios.patch(`${AUTH0_URL}/api/v2/users/${user.userId}`, JSON.stringify(user_data), {headers});
            if(user_response.status == HttpStatusCode.Created) {
                user.userId = user_response.data.user_id;
                const role_data = {"roles":[user.role]}

                // set user role
                const role_response = await axios.post(`${AUTH0_URL}/api/v2/users/${user_response.data.user_id}/roles`, JSON.stringify(role_data), {headers});
            }

            throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

        } catch(err) {
            throw err;
        }
    }

    async getUserById(userid: string): Promise<UserInfo> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const response = await axios.get(`${AUTH0_URL}/api/v2/users/${userid}`, {headers});
            if(response.status === 200) {

                return {
                    userid: response.data.user_id,
                    email: response.data.email,   
                    username: response.data.username,
                    created: response.data.created_at,
                    updated: response.data.updated_at,
                    name: response.data.name,
                    last_ip: response.data.last_ip,
                    last_login: response.data.last_login,
                    logins_count: response.data.logins_count
                }

            }

            throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

        } catch(err) {
            throw err;
        }
    }

    async getUserByEmail(email: string): Promise<UserInfo> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const response = await axios.get(`${AUTH0_URL}/api/v2/users-by-email`, {headers});
            if(response.status === 200) {

                return {
                    userid: response.data.user_id,
                    email: response.data.email,   
                    username: response.data.username,
                    created: response.data.created_at,
                    updated: response.data.updated_at,
                    name: response.data.name,
                    last_ip: response.data.last_ip,
                    last_login: response.data.last_login,
                    logins_count: response.data.logins_count
                }

            }

            throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

        } catch(err) {
            throw err;
        }
    }


    async resetPassword(userid: string): Promise<void> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const params = {
                result_url: "", user_id: userid, client_id: CLIENT_ID, organization_id: "", connection_id: "", email: "", ttl_sec: 0,
                mark_email_as_verified: false, includeEmailInRedirect: false
            };
            const response = await axios.delete(`${AUTH0_URL}/api/v2/ticket/password-change`, {headers});
            if(response.status === 200) {
                return;
            }

            throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

        } catch(err) {
            throw err;
        }
    }

    async deactivateUser(userid: string): Promise<void> {

    }

    async reactivateUser(userid: string): Promise<void> {

    }

    async deleteUser(userid: string): Promise<void> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const response = await axios.delete(`${AUTH0_URL}/api/v2/users/${userid}`, {headers});
            if(response.status === 200) {
                return;
            }

            throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

        } catch(err) {
            throw err;
        }
    }

    async getAccountActivity(userid: string): Promise<void> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const response = await axios.get(`${AUTH0_URL}/api/v2/users/${userid}/logs`, {headers});
            if(response.status === 200) {
                return
            }

            throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

        } catch(err) {
            throw err;
        }

    }

    getLoginURL(): string {
        return "";
    }

    getAccessVerifier(): Handler {
        return auth({
            audience: `${AUDIENCE}`,
            issuerBaseURL: `https://${TENANT_ID}.${DOMAIN}/`,
            tokenSigningAlg: 'RS256',
            jwksUri: `https://${TENANT_ID}.${DOMAIN}/.well-known/jwks.json`
        });
    }

    private async getToken() {
        try {
            const data = {
                client_id: CLIENT_ID, client_secret: CLIENT_SECRET, 
                audience: `${AUTH0_URL}/api/v2`, grant_type: 'client_credentials'
            };
            const response = await axios.post(`${AUTH0_URL}/oauth/token`, JSON.stringify(data), {headers: {"content-type": "application/json"}});
            this.token = response.data.access_token;
        } catch(err) {
            throw err;
        }
    }

}