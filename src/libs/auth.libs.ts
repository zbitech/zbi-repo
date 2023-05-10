import jwt from "jsonwebtoken";
import config from "config";
import bcrypt from "bcrypt";
import { User } from "src/model/model";

export function signJwt(object: Object, keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey", options?: jwt.SignOptions | undefined) {
    console.log(`sign JWT with ${keyName}`);
    console.log(config.get<string>(keyName));
    const signingKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");
    console.log(`signing key => ${signingKey}`);
    return jwt.sign(object, signingKey, {...(options && options), algorithm: "RS256"});
}

export function verifyJwt(token: string, keyName: "accessTokenPublicKey" | "refreshTokenPublicKey") {
    const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString("ascii");
    try {
        console.log(`public key => ${publicKey}`);
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
        console.error(err);
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