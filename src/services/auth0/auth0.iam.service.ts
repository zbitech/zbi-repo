import axios, { HttpStatusCode } from "axios";
import { User } from "src/model/model";
import { AuthenticationClient, ManagementClient } from 'auth0';

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

class Auth0ManagementService {

    token: string = "";
    expiration: number = 3600;

    constructor() {
        this.getToken();
        this.expiration = 3600;

        this.getToken();
    }

    async getUserInfo(user_id: string) {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const response = await axios.get(`${AUTH0_URL}/api/v2/users/${user_id}`, {headers});
            if(response.status === 200) {

                

                return {
                    "user_id": response.data.user_id,
                    "email": response.data.email,
                    "username": response.data.username,
                    "created_at": response.data.created_at,
                    "updated_at": response.data.updated_at,
                    "name": response.data.name,
                    "last_ip": response.data.last_ip,
                    "last_login": response.data.last_login,
                    "logins_count": response.data.logins_count
                }


            } else {
                // return error
            }


        } catch(err) {
            throw err;
        }
    }


    async inviteUser(user: User) {
        try {
            const headers = {"content-type": "application/json", "authorization": `Bearer: ${this.token}`}
            const user_data = {
                "email": user.email,
                "email_verified": false,
                "verify_email": false,
                "name": user.name,
            };

            const response = await axios.post(`${AUTH0_URL}/api/v2/users`, JSON.stringify(user_data), {headers});
            if(response.status == HttpStatusCode.Created) {
                user.userId = response.data.user_id;
                const role_data = {"roles":[user.role]}
                await axios.post(`${AUTH0_URL}/api/v2/users/${response.data.user_id}/roles`, JSON.stringify(role_data), {headers});
            }
        } catch(err) {

        }
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