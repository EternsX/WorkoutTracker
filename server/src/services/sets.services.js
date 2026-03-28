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
export const createSet = async (reps, duration, weight, workout_exercise_id, workoutId, userId) => {
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
      `INSERT INTO sets (reps, duration, weight, set_order, workout_exercise_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [reps ?? null, duration ?? null, weight ?? 0, nextOrder, workout_exercise_id]
    );

    await query("COMMIT");
    return res.rows[0];

  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
};

// --- UPDATE SET ---
export const updateSet = async ({ reps, duration, weight }, setId, workout_exercise_id, workoutId, userId) => {
  if (!setId || !workout_exercise_id || !workoutId || !userId) {
    throw { statusCode: 400, message: "Missing fields" };
  }

  // Check user access
  if (!(await validateUser(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }

  // Check set belongs to this workout_exercise
  if (!(await validateSet(setId, workout_exercise_id))) {
    throw { statusCode: 403, message: "Access denied" };
  }

  // Build the update query dynamically
  const fields = [];
  const values = [];
  let idx = 1;

  if (reps != null) {
    fields.push(`reps = $${idx++}`);
    values.push(reps);
  } else {
    fields.push(`reps = NULL`);
  }

  if (duration != null) {
    fields.push(`duration = $${idx++}`);
    values.push(duration);
  } else {
    fields.push(`duration = NULL`);
  }

  fields.push(`weight = $${idx++}`);
  values.push(weight);

  values.push(setId); // for WHERE clause

  const queryText = `
    UPDATE sets
    SET ${fields.join(", ")}
    WHERE id = $${idx}
    RETURNING *
  `;

  const res = await query(queryText, values);

  if (res.rows.length === 0) {
    throw { statusCode: 404, message: "Set not found" };
  }

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