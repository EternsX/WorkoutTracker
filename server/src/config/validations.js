import { query } from "./db.js";

export async function validateUser(userId, workoutId) {
    const res = await query(
        'SELECT 1 FROM workouts WHERE id = $1 AND user_id = $2',
        [workoutId, userId]
    );
    return res.rows.length > 0;
}

export async function validateWorkoutExercise(workoutId, exerciseId) {
    const res = await query(
        'SELECT 1 FROM workout_exercises WHERE workout_id = $1 AND exercise_id = $2',
        [workoutId, exerciseId]
    );
    return res.rows.length > 0;
}

export async function validateWorkoutExerciseId(workoutId, workoutExerciseId) {
    const res = await query(
        'SELECT 1 FROM workout_exercises WHERE id = $1 AND workout_id = $2',
        [workoutExerciseId, workoutId]
    );
    return res.rows.length > 0;
}

export async function validateSet(setId, workout_exercise_id) {
    const res = await query(`
        SELECT 1
        FROM sets
        WHERE id = $1
        AND workout_exercise_id = $2
    `, [setId, workout_exercise_id]);

    return res.rows.length > 0;
}

export async function validateSessionOwnership(sessionId, userId) {
    const session = await query(
        `SELECT workout_id, user_id FROM workout_sessions WHERE id = $1`,
        [sessionId]
    );

    if (!session.rows.length) {
        const err = new Error("Session not found");
        err.statusCode = 404;
        throw err;
    }

    if (session.rows[0].user_id !== userId) {
        const err = new Error("Access denied");
        err.statusCode = 403;
        throw err;
    }

    return session.rows[0]; 
}
