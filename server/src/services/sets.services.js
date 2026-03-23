import { query } from "../config/db.js";
import { validateUser } from "../config/validations.js";
import { validateSet } from "../config/validations.js";

// --- GET SETS ---
export const getSets = async (workout_exercise_id, workoutId, userId) => {
  if (!workout_exercise_id || !workoutId || !userId)
    throw { statusCode: 400, message: "Missing fields" };

  if (!(await validateUser(userId, workoutId)))
    throw { statusCode: 403, message: "Access denied" };

  const res = await query(
    `
    SELECT s.*
    FROM sets s
    WHERE s.workout_exercise_id = $1
    ORDER BY s.set_order
  `,
    [workout_exercise_id]
  );

  return res.rows;
};

// --- CREATE SET ---
export const createSet = async (reps, weight, workout_exercise_id, workoutId, userId) => {
  if (!workout_exercise_id || !workoutId || !userId)
    throw { statusCode: 400, message: "Missing fields" };

  if (!(await validateUser(userId, workoutId)))
    throw { statusCode: 403, message: "Access denied" };

  await query("BEGIN");

  try {
    // Get current max set order
    const maxRes = await query(
      `SELECT COALESCE(MAX(set_order), 0) AS max_order
       FROM sets
       WHERE workout_exercise_id = $1`,
      [workout_exercise_id]
    );

    const nextOrder = maxRes.rows[0].max_order + 1;

    const res = await query(
      `INSERT INTO sets (reps, weight, set_order, workout_exercise_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [reps, weight, nextOrder, workout_exercise_id]
    );

    await query("COMMIT");
    return res.rows[0];

  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
};

// --- UPDATE SET ---
export const updateSet = async (reps, weight, setId, workout_exercise_id, workoutId, userId) => {
  if (!setId || !workout_exercise_id || !workoutId || !userId)
    throw { statusCode: 400, message: "Missing fields" };

  if (!(await validateUser(userId, workoutId)))
    throw { statusCode: 403, message: "Access denied" };

  if (!(await validateSet(setId, workout_exercise_id)))
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

// --- DELETE SET ---
export const deleteSet = async (setId, workout_exercise_id, workoutId, userId) => {
  if (!setId || !workout_exercise_id || !workoutId || !userId)
    throw { statusCode: 400, message: "Missing fields" };

  if (!(await validateUser(userId, workoutId)))
    throw { statusCode: 403, message: "Access denied" };

  if (!(await validateSet(setId, workout_exercise_id)))
    throw { statusCode: 403, message: "Access denied" };

  const res = await query(
    `DELETE FROM sets
     WHERE id = $1 AND workout_exercise_id = $2
     RETURNING *`,
    [setId, workout_exercise_id]
  );

  if (res.rows.length === 0)
    throw { statusCode: 404, message: "Set not found" };

  return res.rows[0];
};