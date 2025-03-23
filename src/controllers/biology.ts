import { db } from "../db/db.ts";

export class Biology {
    //add questions
    async addBiologyQuestions(ctx: any) {
        try {
            const body = await ctx.request.body.json();
            if (!Array.isArray(body)) {
                ctx.response.status = 400;
                ctx.response.body = {
                    message: "Request body must be an array of questions",
                };
                return;
            }
            const results = [];
            for (const queestionData of body) {
                const {
                    question,
                    option_a,
                    option_b,
                    option_c,
                    option_d,
                    correct_answer,
                } = queestionData;

                //validate input
                if (
                    !question || !option_a || !option_b || !option_c ||
                    !option_d || !correct_answer
                ) {
                    results.push({
                        question,
                        success: false,
                        message: "All fields are required for this question",
                    });
                    continue;
                }
                ctx.response.status = 400;
                ctx.response.body = {
                    message: "All fields are required for this question",
                };
                const result = await db.query(
                    `SELECT * FROM biology WHERE question = ?`,
                    [question],
                );
                if (result.length > 0) {
                    results.push({
                        question,
                        success: false,
                        message: "Question already exists",
                    });
                    continue;
                }
                //insert question
                await db.execute(
                    `INSERT INTO biology (question, option_a, option_b, option_c, option_d, correct_answer) VALUES (?,?,?,?,?,?)`,
                    [
                        question,
                        option_a,
                        option_b,
                        option_c,
                        option_d,
                        correct_answer,
                    ],
                );
                results.push({
                    question,
                    success: true,
                    message: "Question added successfully",
                });
            }
            ctx.response.status = 201;
            ctx.response.body = { results };
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
        }
    }
    //random 25 biology questions
    async randomBioQuestions(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer FROM biology ORDER BY RAND() LIMIT 25`,
            );
            const questions = result.rows || result;
            if (questions.length > 0) {
                ctx.response.status = 200;
                ctx.response.body = questions;
            } else {
                ctx.response.status = 404;
                ctx.response.body = { message: "No questions found" };
            }
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal server error" };
        }
    }
    //test 1 1-25
    async testOne(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer 
                FROM biology
                WHERE id BETWEEN 1 AND 25`,
            );
            const questions = result.rows || result;

            if (questions.length > 0) {
                ctx.response.status = 200;
                ctx.response.body = questions;
            } else {
                ctx.response.status = 404;
                ctx.response.body = { message: "No questions found" };
            }
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { message: "Internal Server Error" };
        }
    }
    //test 2 26-32
    async testTwo(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer 
                FROM biology 
                WHERE id BETWEEN 26 AND 32`,
            );
            const questions = result.rows || result;

            if (questions.length > 0) {
                ctx.response.status = 200;
                ctx.response.body = questions;
            } else {
                ctx.response.status = 404;
                ctx.response.body = { message: "No questions found" };
            }
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { message: "Internal Server Error" };
        }
    }
}
