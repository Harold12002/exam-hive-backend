import { Client } from "../imports/imports.ts";

export const db = await new Client().connect({
    hostname: Deno.env.get("DB_HOSTNAME"),
    username: Deno.env.get("DB_USERNAME"),
    db: Deno.env.get("DB_NAME"),
    password: Deno.env.get("DB_PASSWORD"),
});
