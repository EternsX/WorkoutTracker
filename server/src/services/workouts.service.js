import { query } from "../config/db.js";
import { doesUserOwnWorkout } from "../config/validations.js";

// --- GET all workouts for user ---
export const getWorkouts = async (userId) => {
  if (!userId) throw { statusCode: 400, message: "Missing user" };

  const res = await query(
    "SELECT id, name FROM workouts WHERE user_id = $1",
    [userId]
  );

  return res.rows;
};

// --- GET workout by ID ---
export const getWorkoutById = async (userId, workoutId) => {
  if (!userId || !workoutId) throw { statusCode: 400, message: "Missing fields" };

  if (!(await doesUserOwnWorkout(userId, workoutId)))
    throw { statusCode: 403, message: "Access denied" };

  const res = await query(
    "SELECT id, name FROM workouts WHERE user_id = $1 AND id = $2",
    [userId, workoutId]
  );

  if (!res.rows.length) throw { statusCode: 404, message: "Workout not found" };
  return res.rows[0];
};

// --- CREATE workout ---
export const createWorkout = async (name, userId) => {
  if (!name || !userId) throw { statusCode: 400, message: "Missing fields" };

  const res = await query(
    "INSERT INTO workouts (name, user_id) VALUES ($1, $2) RETURNING id, name",
    [name, userId]
  );

  return res.rows[0];
};

// --- UPDATE workout ---
export const updateWorkout = async (name, workoutId, userId) => {
  if (!name || !workoutId || !userId) throw { statusCode: 400, message: "Missing fields" };

  if (!(await doesUserOwnWorkout(userId, workoutId)))
    throw { statusCode: 403, message: "Access denied" };

  const res = await query(
    "UPDATE workouts SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING id, name",
    [name, workoutId, userId]
  );

  if (!res.rows.length) throw { statusCode: 404, message: "Workout not found" };
  return res.rows[0];
};

// --- DELETE workout ---
export const deleteWorkout = async (workoutId, userId) => {
  if (!workoutId || !userId) throw { statusCode: 400, message: "Missing fields" };

  if (!(await doesUserOwnWorkout(userId, workoutId)))
    throw { statusCode: 403, message: "Access denied" };

  const res = await query(
    "DELETE FROM workouts WHERE id = $1 AND user_id = $2 RETURNING id, name",
    [workoutId, userId]
  );

  if (!res.rows.length) throw { statusCode: 404, message: "Workout not found" };
  return res.rows[0];
};

// --- COMPLETE workout ---
export const completeWorkout = async (sessionId, workoutId, userId) => {
  if (!workoutId || !userId || !sessionId)
    throw { statusCode: 400, message: "Missing fields" };

  if (!(await doesUserOwnWorkout(userId, workoutId)))
    throw { statusCode: 403, message: "Access denied" };

  const res = await query(
    `INSERT INTO completed_workouts (user_id, workout_id, session_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, workoutId, sessionId]
  );

  if (!res.rows.length) throw { statusCode: 404, message: "Workout not found" };
  return res.rows[0];
};