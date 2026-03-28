import { query, getClient } from '../config/db.js';
import { validateUser, validateSessionOwnership, validateWorkoutExerciseId } from '../config/validations.js';

/**
 * Start a new workout session
 */
export const startWorkoutSession = async (workoutId, userId) => {
    if (!workoutId || !userId) {
        const err = new Error("Missing fields");
        err.statusCode = 400;
        throw err;
    }

    if (!(await validateUser(userId, workoutId))) {
        const err = new Error("Access denied");
        err.statusCode = 403;
        throw err;
    }

    const res = await query(
        `INSERT INTO workout_sessions (user_id, workout_id, status)
         VALUES ($1, $2, 'active')
         RETURNING id, user_id, workout_id, started_at, status`,
        [userId, workoutId]
    );

    return res.rows[0];
};

/**
 * Get the active workout session for a user
 */
export const getWorkoutSession = async (userId) => {
    if (!userId) {
        const err = new Error("Missing userId");
        err.statusCode = 400;
        throw err;
    }

    const res = await query(
        `SELECT * FROM workout_sessions WHERE user_id = $1 AND status = 'active' LIMIT 1`,
        [userId]
    );

    return res.rows[0] || null;
};


export const updateProgress = async (
    sessionId,
    userId,
    workout_exercise_id,
    setNumber,
    reps,
    duration,
    weight
) => {
    if (!sessionId || !userId || !workout_exercise_id) {
        const err = new Error("Missing required fields");
        err.statusCode = 400;
        throw err;
    }

    // 1️⃣ Validate session ownership
    const session = await validateSessionOwnership(sessionId, userId);
    if (!session) {
        const err = new Error("Access denied");
        err.statusCode = 403;
        throw err;
    }

    // 2️⃣ Validate that the workout_exercise belongs to this workout
    const validExercise = await validateWorkoutExerciseId(session.workout_id, workout_exercise_id);
    if (!validExercise) {
        const err = new Error("Exercise does not belong to this workout");
        err.statusCode = 400;
        throw err;
    }

    const client = await getClient();
    try {
        await client.query("BEGIN");

        // 3️⃣ Update session progress
        const progress = { workout_exercise_id, setNumber };
        const sessionRes = await client.query(
            `UPDATE workout_sessions
             SET progress = $3::jsonb,
                 last_activity = NOW()
             WHERE id = $1 AND user_id = $2 AND status = 'active'
             RETURNING *`,
            [sessionId, userId, progress]
        );

        if (!sessionRes.rows.length) {
            const err = new Error("Session not found");
            err.statusCode = 404;
            throw err;
        }

        // 4️⃣ Record the completed set
        const setRes = await client.query(
            `INSERT INTO completed_sets 
                 (session_id, workout_exercise_id, set_number, reps, duration, weight, completed_at)
                 VALUES ($1, $2, $3, $4, $5, $6, NOW())
                 RETURNING *`,
            [sessionId, workout_exercise_id, setNumber, reps, duration, weight]
        );

        if (!setRes.rows.length) {
            const err = new Error("Failed to record set");
            err.statusCode = 500;
            throw err;
        }

        await client.query("COMMIT");
        return sessionRes.rows[0];

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Finish or discard a workout session
 */
export const endSession = async (sessionId, userId, status) => {
    if (!sessionId || !userId ) {
        const err = new Error("Missing required fields");
        err.statusCode = 400;
        throw err;
    }

    await validateSessionOwnership(sessionId, userId);

    const res = await query(
        `UPDATE workout_sessions
         SET status = $3, ended_at = NOW()
         WHERE id = $1 AND user_id = $2 AND status = 'active'
         RETURNING *`,
        [sessionId, userId, status]
    );

    if (!res.rows.length) {
        const err = new Error("Session not found or already finished");
        err.statusCode = 404;
        throw err;
    }

    return res.rows[0];
};