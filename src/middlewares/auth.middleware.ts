import { auth } from 'express-oauth2-jwt-bearer';


const TENANT_ID = process.env.AUTH0_TENANT_ID;
const DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET
const AUDIENCE = process.env.AUTH0_AUDIENCE

export const auth0jwtVerifier = auth({
    issuer: `https://${TENANT_ID}.${DOMAIN}`,
    audience: `${AUDIENCE}`,
    issuerBaseURL: `https://${TENANT_ID}.${DOMAIN}`,
});

