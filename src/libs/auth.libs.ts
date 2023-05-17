import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcrypt";
import { User } from "src/model/model";

export function signJwtAccessToken(user: User) {
    return signJwt(user, "accessTokenPrivateKey", { expiresIn: config.get("accesstokenTtl")});
}

export function signJwtRefreshToken(user: User) {
    return signJwt(user, "refreshTokenPrivateKey", { expiresIn: config.get("refreshtokenTtl")});
}

export function verifyJwtAccessToken(token: string) {
    return verifyJwt(token, "accessTokenPublicKey");
}

export function verifyJwtRefreshToken(token: string) {
    return verifyJwt(token, "refreshTokenPublicKey");
}

export function signJwt(object: Object, keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey", options?: jwt.SignOptions | undefined) {
    try {
        const signingKey = config.get<string>(keyName);
        //console.log(`signing key => ${signingKey}`);
        return jwt.sign(object, signingKey, {...(options && options), algorithm: "RS256"});
    } catch(err: any) {
        console.error(`error occurred while signing = ${JSON.stringify(err)}`);
        throw err;
    }
}

export function verifyJwt(token: string, keyName: "accessTokenPublicKey" | "refreshTokenPublicKey") {
    //const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");
    const publicKey = config.get<string>(keyName);
    try {
//        console.log(`public key => ${publicKey}`);
        const decoded = jwt.verify(token, publicKey);
        return {valid: true, expired: false, decoded};
    } catch (e: any) {
        return {valid: false, expired: e.message == "jwt expired", decoded: null};
    }
}

export async function hashPassword(password: string) {
    try {
        const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));
        return await bcrypt.hashSync(password, salt);            
    } catch (err: any) {
//        console.error(err);
        return false;
    }
}

export async function comparePassword(candidatePassword: string, userPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, userPassword)        
    } catch (err: any) {
        console.log(err);
    }

    return false;
}