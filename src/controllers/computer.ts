import { db } from "../db/db.ts";

export class Computer {
    //add computers quesions
    async addComputerQuestions(ctx: any) {
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
                    `SELECT * FROM computer WHERE question = ?`,
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
                    `INSERT INTO computer (question, option_a, option_b, option_c, option_d, correct_answer) VALUES (?,?,?,?,?,?)`,
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
            ctx.response.body = { message: "Internal Server Error" };
        }
    }
    //random 25 computer questions
    async randomComputerQuestions(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer FROM computer ORDER BY RAND() LIMIT 25`,
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
                FROM computer
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
    //test 2 26-50
    async testTwo(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer 
                FROM computer
                WHERE id BETWEEN 26 AND 50`,
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
    //test 3 51-68
    async testThree(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer 
                FROM computer
                WHERE id BETWEEN 51 AND 68`,
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
