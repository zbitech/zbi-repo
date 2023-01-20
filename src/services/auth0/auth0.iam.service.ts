import axios from "axios";

const AUTH0_TENANT_ID = process.env.AUTH0_TENANT_ID;
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_GRANT_TYPE = process.env.AUTH0_GRANT_TYPE;

const AUTH0_URL=`https://${AUTH0_TENANT_ID}.${AUTH0_DOMAIN}`

class Auth0ManagementService {

    token: string = "";
    expiration: number = 3600;

    constructor() {
        this.token = "";
        this.expiration = 3600;

        this.getToken();
    }

    async getUserInfo() {
    }

    private async getToken() {
        try {
            const data = {
                client_id: AUTH0_CLIENT_ID, client_secret: AUTH0_CLIENT_SECRET, 
                audience: `${AUTH0_URL}/api/v2`, grant_type: AUTH0_GRANT_TYPE
            };
            const response = await axios.post(`${AUTH0_URL}/oauth/token`, JSON.stringify(data), {headers: {"content-type": "application/json"}});
            this.token = response.data.access_token;

            // set logic to execute at expiration
        } catch(err) {

        }
    }

}