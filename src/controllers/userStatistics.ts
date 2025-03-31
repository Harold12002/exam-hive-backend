import { db } from "../db/db.ts";

export class UserStatisticsControllers {
    //recording user stats
    async recordExamStats(ctx: any) {
        try {
            const body = await ctx.request.body.json();
            const {
                user_id,
                subject,
                total_questions,
                correct_answers,
                time_spent,
            } = body;

            if (!user_id || !subject || !total_questions || !correct_answers) {
                ctx.response.status = 400;
                ctx.response.body = { message: "All fields are required" };
                return;
            }
            const score = parseFloat(
                ((correct_answers / total_questions) * 100).toFixed(1),
            );
            const pass = score >= 50;
            const passRateUpdate = pass ? 1 : 0;
            const rawScore = correct_answers; 
            const scorePercentage = (correct_answers / total_questions) * 100; 

            await db.execute(
                `INSERT INTO examstats (
    user_id, subject, total_attempts, total_questions_answered, total_correct_answers,
    highest_score, average_score, last_exam_date, last_score, total_time_spent, pass_rate
)
VALUES (?, ?, 1, ?, ?, ?, ?, NOW(), ?, ?, ?)
ON DUPLICATE KEY UPDATE
    total_attempts = total_attempts + 1,
    total_questions_answered = total_questions_answered + VALUES(total_questions_answered),
    total_correct_answers = total_correct_answers + VALUES(total_correct_answers),
    highest_score = GREATEST(highest_score, VALUES(highest_score)),
    average_score = ((average_score * (total_attempts - 1)) + VALUES(average_score)) / total_attempts,

    last_exam_date = VALUES(last_exam_date),
    last_score = VALUES(last_score),
    total_time_spent = total_time_spent + VALUES(total_time_spent),
    pass_rate = ((pass_rate * total_attempts) + ?) / (total_attempts + 1)
`,
                [
                    user_id,
                    subject,
                    total_questions,
                    correct_answers,
                    rawScore,
                    scorePercentage,
                    scorePercentage,
                    time_spent,
                    passRateUpdate,
                    passRateUpdate,
                ],
            );

            ctx.response.status = 200;
            ctx.response.body = { message: "User stats updated successfully" };
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal Server Error" };
        }
    }
    //get stats for specific user
    async getUserStats(ctx: any) {
        try {
            const user_id = ctx.params.user_id;
            const subject = ctx.params.subject;

            const result = await db.query(
                `SELECT * FROM userstats WHERE id = ? AND subject = ?`,
                [
                    user_id,
                    subject,
                ],
            );
            if (result.length === 0) {
                ctx.response.status = 404;
                ctx.response.body = {
                    message: "No stats found for this subject",
                };
                return;
            }
            ctx.response.status = 200;
            ctx.response.body = result[0];
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { message: "Internal Server Error" };
        }
    }
    //gets stas for all users
    async getAllStats(ctx: any) {
        try {
            const user_id = ctx.params.user_id;
            const result = await db.query(
                `SELECT * FROM userstats WHERE user_id = ?`,
                [user_id],
            );
            ctx.response.status = 200;
            ctx.response.body = result;
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { error: "Internal Server Error" };
        }
    }
}
