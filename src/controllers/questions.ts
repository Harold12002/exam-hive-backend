import { db } from "../db/db.ts";

export class QuestionsControllers {
    //adding questions
    async addQuestions(ctx: any) {
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

                // Validate input for each question
                if (
                    !question ||
                    !option_a ||
                    !option_b ||
                    !option_c ||
                    !option_d ||
                    !correct_answer
                ) {
                    results.push({
                        question,
                        success: false,
                        message: "All fields are required for this question",
                    });
                    continue;
                }

                // Check if the question already exists
                const existingQuestion = await db.query(
                    `SELECT * FROM questions WHERE question = ?`,
                    [question],
                );

                if (existingQuestion.length > 0) {
                    results.push({
                        question,
                        success: false,
                        message: "Question already exists",
                    });
                    continue;
                }

                // Insert the question
                await db.execute(
                    `INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?)`,
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
    //random 25 questions
    async handleTest(ctx: any) {
        try {
            const result = await db.query(
                `SELECT id, question, option_a, option_b, option_c, option_d, correct_answer 
             FROM questions ORDER BY RAND() LIMIT 25`,
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
    //getting all questions
    async getAllQuestions(ctx: any) {
        try {
            const result = await db.query(
                `SELECT * FROM questions`,
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
    //submitting answers
    async handleAnswers(ctx: any) {
        try {
            const body = await ctx.request.body.json();
            const userAnswers = body.userAnswers;

            if (!userAnswers || !Array.isArray(userAnswers)) {
                ctx.response.status = 400;
                ctx.response.body = { message: "Invalid answer format" };
                return;
            }

            const questionIds = userAnswers.map((a) => a.id);
            if (questionIds.length === 0) {
                ctx.response.status = 400;
                ctx.response.body = { message: "No question IDs provided" };
                return;
            }

            const placeholders = questionIds.map(() => "?").join(",");
            const result = await db.query(
                `SELECT id, correct_answer FROM questions WHERE id IN (${placeholders})`,
                questionIds,
            );

            const correctAnswers = result.rows || result;
            const answerMap = new Map(
                correctAnswers.map((q: any) => [q.id, q.correct_answer]),
            );

            let score = 0;
            userAnswers.forEach((userAnswer) => {
                if (
                    answerMap.has(userAnswer.id) &&
                    userAnswer.answer === answerMap.get(userAnswer.id)
                ) {
                    score++;
                }
            });

            const passMark = 50;
            const totalQsns = 20;
            const percentage = parseFloat(
                ((score / totalQsns) * 100).toFixed(1),
            );
            const pass = percentage >= passMark;

            let grade;
            if (percentage >= 91) {
                grade = "A+";
            } else if (percentage >= 80) {
                grade = "A";
            } else if (percentage >= 75) {
                grade = "A-";
            } else if (percentage >= 70) {
                grade = "B+";
            } else if (percentage >= 65) {
                grade = "B";
            } else if (percentage >= 60) {
                grade = "B-";
            } else if (percentage >= 55) {
                grade = "C+";
            } else if (percentage >= 50) {
                grade = "C";
            } else {
                grade = "F";
            }

            ctx.response.status = 200;
            ctx.response.body = {
                message: "Test completed",
                score: `${score} out of ${totalQsns}`,
                percentage: percentage + "%",
                pass,
                grade,
            };
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { message: "Internal Server Error" };
        }
    }
}
