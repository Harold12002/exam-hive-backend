import { db } from "../db/db.ts";

export class GeneralKnowledge {
    //adding general knowldege questions
    async addGeneralKnowledgeQuestions(ctx: any) {
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
            for (const questionData of body) {
                const {
                    question,
                    option_a,
                    option_b,
                    option_c,
                    option_d,
                    correct_answer,
                } = questionData;

                //validate input
                if (
                    !question || !option_a || !option_b || !option_c ||
                    !option_d || !correct_answer
                ) {
                    results.push({
                        question,
                        success: false,
                        message: "All fields are required",
                    });
                    continue;
                }
                ctx.response.status = 400;
                ctx.response.body = {
                    message: "All fields are required for this question",
                };
                //check if question already exists
                const result = await db.query(
                    `SELECT * FROM generalknowledge WHERE question = ?`,
                    [question],
                );
                if (result.length > 0) {
                    results.push({
                        question,
                        success: false,
                        message: "Question(s) already exists",
                    });
                    continue;
                }
                //insert questions
                await db.execute(
                    `INSERT INTO generalKnowledge (question, option_a, option_b, option_C, option_d, correct_answer) VALUES (?,?,?,?,?,?)`,
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
                    message: "Question(s) added successfully",
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
    //random 25 general knowledge questions
    async randomGeneralQuestions(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer FROM generalknowledge ORDER BY RAND() LIMIT 25`,
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
                FROM generalknowledge 
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
                FROM generalknowledge
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
    //test 3 51-75
    async testThree(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer 
                FROM generalknowledge
                WHERE id BETWEEN 51 AND 75`,
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
    //test 4 76-100
    async testFour(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer 
                FROM generalknowledge 
                WHERE id BETWEEN 76 AND 100`,
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
    //test 5 101-125
    async testFive(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer 
                FROM generalknowledge 
                WHERE id BETWEEN 101 AND 125`,
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
    //test 6 126-150
    async testSix(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer 
                FROM generalknowledge 
                WHERE id BETWEEN 126 AND 150`,
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
    //test 7 151-175
    async testSeven(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer 
                FROM generalknowledge 
                WHERE id BETWEEN 151 AND 175`,
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
    //test 8 176-191
    async testEight(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer 
                FROM generalknowledge 
                WHERE id BETWEEN 176 AND 191`,
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

    /*async apiTest(ctx: any) {
        try {
            const response = await fetch(
                "https://opentdb.com/api.php?amount=25&category=9&type=multiple",
            );
            const data = await response.json();

            if (data.response_code === 0 && data.results.length > 0) {
                ctx.response.status = 200;
                ctx.response.body = data.results.map((
                    q: any,
                    index: number,
                ) => ({
                    id: index + 51, // Assigning a temporary ID
                    question: q.question,
                    option_a: q.incorrect_answers[0] || "",
                    option_b: q.incorrect_answers[1] || "",
                    option_c: q.incorrect_answers[2] || "",
                    option_d: q.correct_answer,
                    correct_answer: q.correct_answer,
                }));
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
        */
}
