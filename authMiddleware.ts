import { createSecretKey } from "./src/helpers/userHelpers.ts";
import { verify1 } from "./src/imports/imports.ts";

export async function authMiddleware(ctx: any, next: Function) {
    const authHeader = ctx.request.headers.get("Authorization");

    //check if header exists
    if (!authHeader) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Authorization header is missing" };
        return;
    }

    //extract token from header
    const token = authHeader.split(" ")[1];
    if (!token) {
        ctx.response.status = 401;
        ctx.response.body = { error: "Token is missing" };
        return;
    }
    try {
        const cryptoKey = await createSecretKey();
        const payload = await verify1(token, cryptoKey);

        ctx.state.user = payload;
        await next();
    } catch (error) {
        console.error(`Token verification error:`, error);
        ctx.response.status = 401;
        ctx.response.body = { error: "Invalid or expired token" };
    }
}
