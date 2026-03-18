import { query } from "../config/db.js";
import { validateUser } from "../config/validations.js";
import { validateSet } from "../config/validations.js";


// --- Get exercises for a workout ---
export const getSets = async (exerciseId, workoutId, userId) => {
    if (!exerciseId || !workoutId || !userId)
        throw { statusCode: 400, message: "Missing fields" };

    if (!(await validateUser(userId, workoutId)))
        throw { statusCode: 403, message: "Access denied" };

    const res = await query(`
        SELECT s.*
        FROM sets s
        JOIN workout_exercises we ON s.workout_exercise_id = we.id
        WHERE we.workout_id = $1
        AND we.exercise_id = $2
        ORDER BY s.set_order
    `, [workoutId, exerciseId]);

    return res.rows;
};
// --- Create a new Set ---
export const createSet = async (reps, weight, exerciseId, workoutId, userId) => {
    if (!exerciseId || !workoutId || !userId)
        throw { statusCode: 400, message: "Missing fields" };

    if (!(await validateUser(userId, workoutId)))
        throw { statusCode: 403, message: "Access denied" };

    await query("BEGIN");

    try {
        const maxRes = await query(
            `SELECT 
                we.id AS we_id,
                COALESCE(MAX(s.set_order), 0) AS max_order
             FROM workout_exercises we
             LEFT JOIN sets s ON s.workout_exercise_id = we.id
             WHERE we.workout_id = $1
             AND we.exercise_id = $2
             GROUP BY we.id`,
            [workoutId, exerciseId]
        );

        if (maxRes.rows.length === 0)
            throw { statusCode: 404, message: "Exercise not found in workout" };

        const nextOrder = maxRes.rows[0].max_order + 1;
        const workoutExerciseId = maxRes.rows[0].we_id;

        const res = await query(
            `INSERT INTO sets (reps, weight, set_order, workout_exercise_id)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [reps, weight, nextOrder, workoutExerciseId]
        );

        await query("COMMIT");
        return res.rows[0];

    } catch (err) {
        await query("ROLLBACK");
        throw err;
    }
};

// --- Update a Set ---
export const updateSet = async (reps, weight, setId, exerciseId, workoutId, userId) => {
    if (!setId || !exerciseId || !workoutId || !userId)
        throw { statusCode: 400, message: "Missing fields" };

    if (!(await validateUser(userId, workoutId)))
        throw { statusCode: 403, message: "Access denied" };

    if (!(await validateSet(setId, workoutId, exerciseId)))
        throw { statusCode: 403, message: "Access denied" };

    const res = await query(
        `UPDATE sets
         SET reps = $1, weight = $2
         WHERE id = $3
         RETURNING *`,
        [reps, weight, setId]
    );

    if (res.rows.length === 0)
        throw { statusCode: 404, message: "Set not found" };

    return res.rows[0];
};

// --- Delete a Set ---
export const deleteSet = async (setId, exerciseId, workoutId, userId) => {
    if (!setId || !exerciseId || !workoutId || !userId)
        throw { statusCode: 400, message: "Missing fields" };

    if (!(await validateUser(userId, workoutId)))
        throw { statusCode: 403, message: "Access denied" };
    if (!(await validateSet(setId, workoutId, exerciseId)))
        throw { statusCode: 403, message: "Access denied" };

    const res = await query(`
        DELETE FROM sets s
        USING workout_exercises we
        WHERE s.id = $1
        AND s.workout_exercise_id = we.id
        AND we.exercise_id = $2
        AND we.workout_id = $3
        RETURNING s.*
    `, [setId, exerciseId, workoutId]);

    if (res.rows.length === 0)
        throw { statusCode: 404, message: "Set not found" };

    return res.rows[0];
};