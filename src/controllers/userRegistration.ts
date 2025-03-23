import { db } from "../db/db.ts";
import {
    comparePassword,
    generateResetToken,
    generateToken,
    hashPassword,
    verifyResetToken,
} from "../helpers/userHelpers.ts";
import { hash } from "../imports/imports.ts";

export class UserControllers {
    //register users
    async handleRegister(ctx: any) {
        try {
            const body = await ctx.request.body.json();
            let { username, email, password, role } = body;

            //validate input
            if (!username || !email || !password) {
                ctx.response.status = 401;
                ctx.response.body = { message: "All fields are required" };
                return;
            }

            //checking if user exists AND username is not taken
            const result = await db.query(
                `SELECT * FROM users WHERE username = ?`,
                [username],
            );
            if (result.length > 0) {
                ctx.response.status = 401;
                ctx.response.body = { message: "Username already taken" };
                return;
            }

            //validating email
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                ctx.response.status = 400;
                ctx.response.body = { error: "Invalid email" };
                return;
            }

            //validate password
            const minLength = 8;
            const maxLength = 64;

            if (password.length < minLength || password.length > maxLength) {
                ctx.response.status = 400;
                ctx.response.body = {
                    message: "Password must be between 8 and 64 characters. ",
                };
                return;
            }
            //Check for lowercase, uppercase,digit and special character
            const uppercase = /[A-Z]/.test(password);
            const lowercase = /[a-z]/.test(password);
            const digit = /\d/.test(password);
            const specialChar = /[!@#$%^&*()_\-=+<>?]/.test(password);

            if (!uppercase || !lowercase || !digit || !specialChar) {
                ctx.response.status = 400;
                ctx.response.body = {
                    message:
                        "Password must include uppercase, lowercase, digit and a special character. ",
                };
                return;
            }
            //hash password
            const hashedPassword = await hashPassword(password);

            //set default role to student
            if (role !== "admin") {
                role = "student";
            }
            //insert user into db
            await db.execute(
                `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
                [
                    username,
                    email,
                    hashedPassword,
                    role,
                ],
            );
            ctx.response.status = 201;
            ctx.response.body = "User registered successfully";
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
        }
    }
    //login users
    async handleLogin(ctx: any) {
        try {
            const body = await ctx.request.body.json();
            const { username, password } = body;

            //validate input
            if (!username || !password) {
                ctx.response.status = 400;
                ctx.response.body = { message: "All fields are required" };
                return;
            }

            //check if user exits and username is correct
            const result = await db.query(
                `SELECT * FROM users WHERE username = ?`,
                [username],
            );
            if (!result) {
                ctx.response.status = 404;
                ctx.response.body = {
                    message: "User not found or incorrect username",
                };
                return;
            }
            //verify password
            const user = result[0];
            const isPasswordValid = await comparePassword(
                password,
                user.password,
            );
            if (!isPasswordValid) {
                ctx.reponse.status = 401;
                ctx.response.body = { error: "Invalid Credentials" };
                return;
            }

            //generate a jwt token
            const token = await generateToken(user.username, user.role);

            //respond with token
            ctx.response.status = 200;
            ctx.response.body = { token };
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { message: "Internal server error" };
        }
    }
    //request password reset
    async requestPasswordReset(ctx: any) {
        try {
            const { username } = await ctx.request.body.json();

            //check if user exists
            const [user] = await db.query(
                `SELECT * FROM users WHERE username = ?`,
                [username],
            );
            if (!user) {
                ctx.response.status = 404;
                ctx.response.body = { message: "User not found" };
                return;
            }

            //generate reset token
            const resetToken = await generateResetToken(username);

            ctx.response.status = 200;
            ctx.response.body = {
                message: "Password reset token sent",
                resetToken,
            };
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
        }
    }
    //verify toke and reset password
    async resetPassword(ctx: any) {
        try {
            const { token, newPassword } = await ctx.request.body.json();

            //verify token
            let username;
            try {
                username = await verifyResetToken(token);
            } catch (error) {
                console.error(error);
                ctx.response.status = 400;
                ctx.response.body = { message: "Inavlid or expired token" };
                return;
            }
            //hash new password
            const hashedPassword = await hash(newPassword);

            //update users password
            await db.query(`UPDATE users SET PASSWORD = ? WHERE username = ?`, [
                hashedPassword,
                username,
            ]);
            ctx.response.status = 200;
            ctx.response.body = { message: "Password reset successful" };
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
        }
    }
}
