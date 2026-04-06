import { query } from "../config/db.js";
import {
  doesUserOwnWorkout,
  doesWorkoutContainExercise,
  doesSetBelongToExercise
} from "../config/validations.js";

// --- GET SETS ---
export const getSets = async (workoutId, workoutExerciseId, userId) => {

  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }

  if (!(await doesWorkoutContainExercise(workoutId, workoutExerciseId))) {
    throw { statusCode: 404, message: "Exercise not found in this workout" };
  }

  const res = await query(
    `SELECT s.*
     FROM sets s
     WHERE s.workout_exercise_id = $1
     ORDER BY s.set_order`,
    [workoutExerciseId]
  );

  return res.rows;
};

// --- CREATE SET ---
export const createSet = async (value, type, weight, workoutExerciseId, workoutId, userId) => {
  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }

  if (!(await doesWorkoutContainExercise(workoutId, workoutExerciseId))) {
    throw { statusCode: 404, message: "Exercise not found in this workout" };
  }

  await query("BEGIN");
  try {
    // Determine next set order
    const maxRes = await query(
      `SELECT COALESCE(MAX(set_order), 0) AS max_order
       FROM sets
       WHERE workout_exercise_id = $1`,
      [workoutExerciseId]
    );
    const nextOrder = maxRes.rows[0].max_order + 1;

    // Insert with dynamic field depending on type
    const res = await query(
      `INSERT INTO sets (reps, duration, weight, set_order, workout_exercise_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        type === "reps" ? value : null,
        type === "time" ? value : null,
        weight,
        nextOrder,
        workoutExerciseId
      ]
    );

    await query("COMMIT");
    return res.rows[0];
  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
};

// --- UPDATE SET ---
export const updateSet = async (value, type, weight, setId, workoutExerciseId, workoutId, userId) => {
  // --- Authorization checks ---
  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }

  if (!(await doesSetBelongToExercise(setId, workoutExerciseId))) {
    throw { statusCode: 404, message: "Set not found in this exercise" };
  }

  // --- Build dynamic SET clause ---
  const fields = [];
  const values = [];
  let idx = 1;

  if (type === "reps") {
    fields.push(`reps = $${idx++}`);
    values.push(value);
  } else if (type === "time") {
    fields.push(`duration = $${idx++}`);
    values.push(value);
  }

  // Always update weight
  fields.push(`weight = $${idx++}`);
  values.push(weight);

  // WHERE clause
  values.push(setId);
  const queryText = `
    UPDATE sets
    SET ${fields.join(", ")}
    WHERE id = $${idx}
    RETURNING *
  `;

  const res = await query(queryText, values);

  if (!res.rows.length) throw { statusCode: 404, message: "Set not found" };

  return res.rows[0];
};

// --- DELETE SET ---
export const deleteSet = async (setId, workoutExerciseId, workoutId, userId) => {

  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }

  if (!(await doesSetBelongToExercise(setId, workoutExerciseId))) {
    throw { statusCode: 404, message: "Set not found in this exercise" };
  }

  const res = await query(
    `DELETE FROM sets
     WHERE id = $1 AND workout_exercise_id = $2
     RETURNING *`,
    [setId, workoutExerciseId]
  );

  if (!res.rows.length) throw { statusCode: 404, message: "Set not found" };
  return res.rows[0];
};