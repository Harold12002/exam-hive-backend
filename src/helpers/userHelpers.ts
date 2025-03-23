import { compare, create, hash, verify1 } from "../imports/imports.ts";

//function to hash password
export async function hashPassword(password: string) {
    return await hash(password);
}
const JWT_SECRET = "your-secret-key";

//secret key function
export async function createSecretKey() {
    return await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(JWT_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"],
    );
}
//function to create role
export function roleMiddleware(requiredRole: string) {
    return async (ctx: any, next: Function) => {
        const user = ctx.state.user;

        if (!user || user.role !== requiredRole) {
            ctx.response.status = 403;
            ctx.response.body = {
                error: "You are unauthorized to perform this action.",
            };
            return;
        }
        await next();
    };
}
//function to generate jwt
export async function generateToken(username: string, role: string) {
    const payLoad = {
        username,
        role,
        exp: Math.floor(Date.now() + 60 * 60 * 100), //valid for 1hr
    };
    const cryptoKey = await createSecretKey();
    return await create({ alg: "HS256", typ: "JWT" }, payLoad, cryptoKey);
}
//function to verify token
export async function verifyToken(token: string) {
    try {
        const cryptoKey = await createSecretKey();
        const payLoad = await verify1(token, cryptoKey);
        return { valid: true, payLoad };
    } catch (error) {
        console.error(`Token verification error`, error);
        return { valid: false };
    }
}
//function to compare passwords
export async function comparePassword(
    password: string,
    hashedPassword: string,
) {
    return await compare(password, hashedPassword);
}
//function to generate reset jwt
export async function generateResetToken(username: string) {
    const payLoad = {
        username,
        exp: Math.floor(Date.now() + 60 * 60 * 100), //valid for 1hr
    };
    const cryptoKey = await createSecretKey();
    return await create({ alg: "HS256", typ: "JWT" }, payLoad, cryptoKey);
}
//function to verify reset token
export async function verifyResetToken(token: string) {
    try {
        const cryptoKey = await createSecretKey();
        const payLoad = await verify1(token, cryptoKey);
        return { valid: true, payLoad };
    } catch (error) {
        console.error(error);
        return { valid: false };
    }
}
