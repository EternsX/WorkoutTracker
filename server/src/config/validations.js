// validations.js
import { query } from "./db.js";

/**
 * ✅ Boolean checks (returns true/false)
 */

// Check if a user owns a specific workout
export async function doesUserOwnWorkout(userId, workoutId) {
    const res = await query(
        'SELECT 1 FROM workouts WHERE id = $1 AND user_id = $2',
        [workoutId, userId]
    );
    return res.rows.length > 0;
}

// Check if a workout contains a specific exercise
export async function doesWorkoutContainExercise(workoutId, workoutExerciseId) {
    const res = await query(
        'SELECT 1 FROM workout_exercises WHERE workout_id = $1 AND id = $2',
        [workoutId, workoutExerciseId]
    );
    return res.rows.length > 0;
}

// Check if a workout contains a specific workout_exercise_id
export async function doesWorkoutHaveWorkoutExerciseId(workoutId, workoutExerciseId) {
    const res = await query(
        'SELECT 1 FROM workout_exercises WHERE id = $1 AND workout_id = $2',
        [workoutExerciseId, workoutId]
    );
    return res.rows.length > 0;
}

// Check if a set belongs to a specific workout_exercise
export async function doesSetBelongToExercise(setId, workoutExerciseId) {
    const res = await query(
        `SELECT 1
         FROM sets
         WHERE id = $1 AND workout_exercise_id = $2`,
        [setId, workoutExerciseId]
    );
    return res.rows.length > 0;
}

/**
 * ⚡ Throws errors if the validation fails
 */

// Get a session only if it belongs to the user, otherwise throw
export async function getSessionOrThrowIfNotOwned(sessionId, userId) {
    const session = await query(
        'SELECT workout_id, user_id FROM workout_sessions WHERE id = $1',
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