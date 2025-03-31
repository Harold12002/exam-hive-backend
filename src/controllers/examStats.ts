import { db } from "../db/db.ts";

export class ExamStats {
    async recordExamStats(ctx: any) {
        try {
            const body = await ctx.request.body.json();
            const {
                user_id,
                score,
                subject,
                questions_attempted,
                correct_answers,
                average_mark,
                highest_score,
                score_percentage,
            } = body;

            if (
                !user_id || !subject || !questions_attempted ||
                !correct_answers ||
                !score
            ) {
                ctx.response.status = 400;
                ctx.response.body = { message: "All fields are required" };
                return;
            }
            await db.execute(
                `INSERT INTO examstats (
                user_id, subject, score, questions_attempted, correct_answers, average_mark,
                highest_score, score_percentage
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                score = VALUES(score),
                questions_attempted = questions_attempted + VALUES(questions_attempted),
                correct_answers = correct_answers + VALUES(correct_answers),
                average_mark = correct_answers / GREATEST(questions_attempted, 1),
                highest_score = GREATEST(highest_score, VALUES(score)), 
                score_percentage = (correct_answers / GREATEST(questions_attempted, 1)) * 100;
                `,
                [
                    user_id,
                    subject,
                    score,
                    questions_attempted,
                    correct_answers,
                    average_mark,
                    highest_score,
                    score_percentage,
                ],
            );
            ctx.response.status = 200;
            ctx.response.body = {
                message: "User Statistics Updated successfully",
            };
        } catch (error) {
            console.error(error);
            ctx.response.status = 500;
            ctx.response.body = { message: "Internal server error." };
        }
    }
}
