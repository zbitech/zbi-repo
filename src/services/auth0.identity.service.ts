import axios, { HttpStatusCode } from "axios";
import { User, UserInfo } from "../model/model";
import { ServiceError, ServiceErrorType } from "../libs/errors";
import { IdentityService, UserRepository } from "../interfaces";
import { Handler } from "express";
import { auth } from 'express-oauth2-jwt-bearer';

//const AUTH0_TENANT_ID = process.env.AUTH0_TENANT_ID;
//const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
//const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
//const AUTH0_CONNECTION_ID = process.env.AUTH0_CONNECTION_ID;
//const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
//const AUTH0_GRANT_TYPE = process.env.AUTH0_GRANT_TYPE;

const TENANT_ID = process.env.AUTH0_TENANT_ID;
const DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET
const AUDIENCE = process.env.AUTH0_AUDIENCE
const CONNECTION_ID =  process.env.AUTH0_CONNECTION_ID;

const AUTH0_URL=`https://${TENANT_ID}.${DOMAIN}`

export default class Auth0IdentityService implements IdentityService {

    token: string = "";
    expiration: number = 3600;

    private repository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.repository = userRepository;
        this.getToken();
        this.expiration = 3600;

        this.getToken();
    }


    async createUser(user: User): Promise<User> {
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
                user.userid = user_response.data.user_id;
                const role_data = {"roles":[user.role]}

                // set user role
                const role_response = await axios.post(`${AUTH0_URL}/api/v2/users/${user_response.data.user_id}/roles`, JSON.stringify(role_data), {headers});

                const newUser = await this.repository.createUser(user);


                return newUser;
            }

            throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

        } catch(err) {
            throw err;
        }
    }

    async updateUser(user: User): Promise<User> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const user_data = {
                "email": user.email,
                "name": user.name,
            };

            const user_response = await axios.patch(`${AUTH0_URL}/api/v2/users/${user.userid}`, JSON.stringify(user_data), {headers});
            if(user_response.status == HttpStatusCode.Created) {
                user.userid = user_response.data.user_id;
                const role_data = {"roles":[user.role]}

                // set user role
                const role_response = await axios.post(`${AUTH0_URL}/api/v2/users/${user_response.data.user_id}/roles`, JSON.stringify(role_data), {headers});

                const newUser = await this.repository.updateUser(user);

                return newUser;
            }

            throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

        } catch(err) {
            throw err;
        }
    }

    async getUserById(userid: string): Promise<User> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const response = await axios.get(`${AUTH0_URL}/api/v2/users/${userid}`, {headers});
            if(response.status === HttpStatusCode.Ok) {

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

    async getUserByEmail(email: string): Promise<User> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const response = await axios.get(`${AUTH0_URL}/api/v2/users-by-email`, {headers});
            if(response.status === HttpStatusCode.Ok) {

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
            if(response.status === HttpStatusCode.Ok) {
                return;
            }

            throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

        } catch(err) {
            throw err;
        }
    }

    async deactivateUser(userid: string): Promise<void> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const user_data = {blocked: true};

            const user_response = await axios.patch(`${AUTH0_URL}/api/v2/users/${userid}`, JSON.stringify(user_data), {headers});
            if(user_response.status == HttpStatusCode.Ok) {
                return this.repository.deactivateUser(userid);
            }

            throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

        } catch(err) {
            throw err;
        }
    }

    async activateUser(userid: string): Promise<void> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const user_data = {blocked: false};

            const user_response = await axios.patch(`${AUTH0_URL}/api/v2/users/${userid}`, JSON.stringify(user_data), {headers});
            if(user_response.status == HttpStatusCode.Ok) {
                return this.repository.activateUser(userid);
            }

            throw new ServiceError(ServiceErrorType.UNAVAILABLE, "");

        } catch(err) {
            throw err;
        }
    }

    async deleteUser(userid: string): Promise<void> {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const response = await axios.delete(`${AUTH0_URL}/api/v2/users/${userid}`, {headers});
            if(response.status === HttpStatusCode.Ok) {
                return this.repository.deleteUser(userid);
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
            if(response.status === HttpStatusCode.Ok) {
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