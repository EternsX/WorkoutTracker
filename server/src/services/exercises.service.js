    import { query } from "../config/db.js";

    async function validateUser(userId, workoutId) {
        const res = await query('SELECT id FROM workouts WHERE id = $1 and user_id = $2', [workoutId, userId]);
        return res.rows.length > 0;
    }

    export const getExercises = async (workoutId, userId) => {
        if (!workoutId || !userId) {
            const err = new Error("Missing workout");
            err.statusCode = 400;
            throw err;
        }

        if (!(await validateUser(userId, workoutId))) {
            const err = new Error("Access denied");
            err.statusCode = 403;
            throw err;
        }

        const res = await query(
            "SELECT id, name, sets, reps FROM exercises WHERE workout_id = $1",
            [workoutId]
        );

        return res.rows;
    };



    export const createExercise = async (name, sets, reps, workoutId, userId) => {
        if (!name || !userId || !workoutId || sets == null || reps == null) {
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
            "INSERT INTO exercises (name, sets, reps, workout_id) VALUES ($1, $2, $3, $4) RETURNING id, name",
            [name, sets, reps, workoutId]
        );

        return res.rows[0];
    };

    export const updateExercise = async (name, sets, reps, exerciseId, workoutId, userId) => {
        if (!name || !userId || !workoutId || sets == null || reps == null || !exerciseId) {
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
            `UPDATE exercises 
                SET name = $1, sets = $2, reps = $3
                WHERE id = $4 AND workout_id = $5
                RETURNING id, name, sets, reps`,
            [name, sets, reps, exerciseId, workoutId]
        );

        if (res.rows.length === 0) {
            const err = new Error("Exercise not found");
            err.statusCode = 404;
            throw err;
        }

        return res.rows[0];
    };

    export const deleteExercise = async (exerciseId, workoutId, userId) => {
        if (!workoutId || !userId || !exerciseId) {
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
            "DELETE FROM exercises WHERE id = $1 AND workout_id = $2 RETURNING id, name",
            [exerciseId, workoutId]
        );

        if (res.rows.length === 0) {
            const err = new Error("Exercise not found");
            err.statusCode = 404;
            throw err;
        }

        return res.rows[0];
    };