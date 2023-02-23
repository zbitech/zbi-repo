import { NextFunction, Request, Response } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { mainLogger as logger } from '../logger';


const TENANT_ID = process.env.AUTH0_TENANT_ID;
const DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET
const AUDIENCE = process.env.AUTH0_AUDIENCE

const auth0jwtVerifier = auth({
//    issuer: `https://${TENANT_ID}.${DOMAIN}`,
    audience: `https://zbi-control-plane`,
    issuerBaseURL: `https://dev-18udhi373ksoxehw.us.auth0.com/`,
    tokenSigningAlg: 'RS256',
    jwksUri: `https://dev-18udhi373ksoxehw.us.auth0.com/.well-known/jwks.json`
});

const basicJwtVerifier = function(request: Request, response: Response, next: NextFunction) {
    logger.info(`checking for jwt ...`);
    next();
}

export const jwtVerifier = basicJwtVerifier;
// export const jwtVerifier = auth0jwtVerifier;