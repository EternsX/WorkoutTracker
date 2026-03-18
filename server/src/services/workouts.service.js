import { query } from "../config/db.js";
import { validateUser } from "../config/validations.js";

export const getWorkouts = async (userId) => {
    if (!userId) {
        const err = new Error("Missing user");
        err.statusCode = 400;
        throw err;
    }

    const res = await query(
        "SELECT id, name FROM workouts WHERE user_id = $1",
        [userId]
    );

    return res.rows;
};

export const getWorkoutById = async (userId, workoutId) => {
    if (!userId || !workoutId) {
        const err = new Error("Missing fields");
        err.statusCode = 400;
        throw err;
    }

    if (!(await validateUser(userId, workoutId))) 
        throw { statusCode: 403, message: "Access denied" };

    const res = await query(
        "SELECT id, name FROM workouts WHERE user_id = $1 AND id = $2",
        [userId, workoutId]
    );

    if (res.rows.length === 0) {
        const err = new Error("Workout not found");
        err.statusCode = 404;
        throw err;
    }

    return res.rows[0];
};

export const createWorkout = async (name, userId) => {
    if (!name || !userId) {
        const err = new Error("Missing fields");
        err.statusCode = 400;
        throw err;
    }


    const res = await query(
        "INSERT INTO workouts (name, user_id) VALUES ($1, $2) RETURNING id, name",
        [name, userId]
    );

    return res.rows[0];
};

export const updateWorkout = async (name, workoutId, userId) => {
    if (!name || !workoutId || !userId) {
        const err = new Error("Missing fields");
        err.statusCode = 400;
        throw err;
    }

    if (!(await validateUser(userId, workoutId))) 
        throw { statusCode: 403, message: "Access denied" };


    const res = await query(
        "UPDATE workouts SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING id, name",
        [name, workoutId, userId]
    );

    if (res.rows.length === 0) {
        const err = new Error("Workout not found");
        err.statusCode = 404;
        throw err;
    }

    return res.rows[0];
};

export const deleteWorkout = async (workoutId, userId) => {
    if (!workoutId || !userId) {
        const err = new Error("Missing fields");
        err.statusCode = 400;
        throw err;
    }

    if (!(await validateUser(userId, workoutId))) 
        throw { statusCode: 403, message: "Access denied" };

    const res = await query(
        "DELETE FROM workouts WHERE id = $1 AND user_id = $2 RETURNING id, name",
        [workoutId, userId]
    );

    if (res.rows.length === 0) {
        const err = new Error("Workout not found");
        err.statusCode = 404;
        throw err;
    }

    return res.rows[0];
};

export const completeWorkout = async (workoutId, userId) => {
    if (!workoutId || !userId) {
        const err = new Error("Missing fields");
        err.statusCode = 400;
        throw err;
    }

    if (!(await validateUser(userId, workoutId))) 
        throw { statusCode: 403, message: "Access denied" };

    const res = await query(
        "INSERT INTO workouts user_id, workout_id VALUES ($1, $2) RETURNING id, name",
        [userId, workoutId]
    );

    if (res.rows.length === 0) {
        const err = new Error("Workout not found");
        err.statusCode = 404;
        throw err;
    }

    return res.rows[0];
};