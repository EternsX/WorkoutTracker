import { query } from "../config/db.js";

// --- Validation helpers ---
async function validateUser(userId, workoutId) {
    const res = await query(
        'SELECT 1 FROM workouts WHERE id = $1 AND user_id = $2',
        [workoutId, userId]
    );
    return res.rows.length > 0;
}

async function validateWorkoutExercise(workoutId, exerciseId) {
    const res = await query(
        'SELECT 1 FROM workout_exercises WHERE workout_id = $1 AND exercise_id = $2',
        [workoutId, exerciseId]
    );
    return res.rows.length > 0;
}

// --- Get exercises for a workout ---
export const getExercises = async (workoutId, userId) => {
    if (!workoutId || !userId) throw { statusCode: 400, message: "Missing workout" };

    if (!(await validateUser(userId, workoutId))) throw { statusCode: 403, message: "Access denied" };

    const res = await query(`
        SELECT 
            e.id,
            e.name,
            we.exercise_order,
            we.created_at
        FROM exercises e
        JOIN workout_exercises we ON e.id = we.exercise_id
        WHERE we.workout_id = $1
        ORDER BY we.exercise_order
    `, [workoutId]);

    return res.rows;
};

// --- Create a new exercise ---
export const createExercise = async (name, workoutId, userId) => {
    if (!name || !workoutId || !userId) throw { statusCode: 400, message: "Missing fields" };

    if (!(await validateUser(userId, workoutId))) throw { statusCode: 403, message: "Access denied" };

    // Use transaction to ensure both inserts succeed
    await query("BEGIN");
    try {
        // Get next exercise_order
        const maxRes = await query(
            "SELECT COALESCE(MAX(exercise_order), 0) AS max_order FROM workout_exercises WHERE workout_id = $1",
            [workoutId]
        );
        const nextOrder = maxRes.rows[0].max_order + 1;

        // Insert exercise
        const res = await query(
            "INSERT INTO exercises (name) VALUES ($1) RETURNING *",
            [name]
        );
        const exerciseId = res.rows[0].id;

        // Link to workout with order and timestamp
        await query(
            "INSERT INTO workout_exercises (workout_id, exercise_id, exercise_order, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)",
            [workoutId, exerciseId, nextOrder]
        );

        await query("COMMIT");
        return res.rows[0];

    } catch (err) {
        await query("ROLLBACK");
        throw err;
    }
};

// --- Update an exercise ---
export const updateExercise = async (name, exerciseId, workoutId, userId) => {
    if (!name || !exerciseId || !workoutId || !userId) throw { statusCode: 400, message: "Missing fields" };

    if (!(await validateUser(userId, workoutId))) throw { statusCode: 403, message: "Access denied" };
    if (!(await validateWorkoutExercise(workoutId, exerciseId))) throw { statusCode: 403, message: "Access denied" };

    const res = await query(
        "UPDATE exercises SET name = $1 WHERE id = $2 RETURNING *",
        [name, exerciseId]
    );

    if (res.rows.length === 0) throw { statusCode: 404, message: "Exercise not found" };

    return res.rows[0];
};

// --- Delete an exercise ---
export const deleteExercise = async (exerciseId, workoutId, userId) => {
    if (!exerciseId || !workoutId || !userId) throw { statusCode: 400, message: "Missing fields" };

    if (!(await validateUser(userId, workoutId))) throw { statusCode: 403, message: "Access denied" };
    if (!(await validateWorkoutExercise(workoutId, exerciseId))) throw { statusCode: 403, message: "Access denied" };

    // Transaction to delete from both tables
    await query("BEGIN");
    try {
        const delLink = await query(
            "DELETE FROM workout_exercises WHERE exercise_id = $1 AND workout_id = $2 RETURNING *",
            [exerciseId, workoutId]
        );
        if (delLink.rows.length === 0) throw { statusCode: 404, message: "Exercise not found in this workout" };

        const res = await query(
            "DELETE FROM exercises WHERE id = $1 RETURNING *",
            [exerciseId]
        );
        if (res.rows.length === 0) throw { statusCode: 404, message: "Exercise not found" };

        await query("COMMIT");
        return res.rows[0];

    } catch (err) {
        await query("ROLLBACK");
        throw err;
    }
};