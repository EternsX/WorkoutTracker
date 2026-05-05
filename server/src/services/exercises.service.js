// exercises.service.js
import { query } from "../config/db.js";
import {
  doesUserOwnWorkout,
  doesWorkoutHaveWorkoutExerciseId
} from "../config/validations.js";

/* ================= HELPERS ================= */

// 🔹 get full exercise object
const getExerciseByWorkoutExerciseId = async (workoutExerciseId) => {
  const res = await query(`
    SELECT 
      e.id,
      e.name,
      we.id AS workout_exercise_id,
      we.rest_after_exercise,
      we.rest_between_sets,
      we.exercise_order,
      we.created_at,
      we.type,
      we.workout_id
    FROM workout_exercises we
    JOIN exercises e ON e.id = we.exercise_id
    WHERE we.id = $1
  `, [workoutExerciseId]);

  return res.rows[0] || null;
};

// 🔹 get exercise_id only
const getExerciseId = async (workoutExerciseId) => {
  const res = await query(
    "SELECT exercise_id FROM workout_exercises WHERE id = $1",
    [workoutExerciseId]
  );
  return res.rows[0]?.exercise_id;
};

/* ================= SERVICES ================= */

// 🔹 GET exercises
export const getExercises = async (workoutId, userId) => {
  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }

  const res = await query(`
    SELECT 
      e.id,
      e.name,
      we.id AS workout_exercise_id,
      we.rest_after_exercise,
      we.rest_between_sets,
      we.exercise_order,
      we.created_at,
      we.type,
      we.workout_id
    FROM workout_exercises we
    JOIN exercises e ON e.id = we.exercise_id
    WHERE we.workout_id = $1
    ORDER BY we.exercise_order
  `, [workoutId]);

  return res.rows;
};

// 🔹 GET single exercise (optional but useful)
export const getExercise = async (workoutId, workoutExerciseId, userId) => {
  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }

  const exercise = await getExerciseByWorkoutExerciseId(workoutExerciseId);

  if (!exercise) {
    throw { statusCode: 404, message: "Exercise not found" };
  }

  return exercise;
};

// 🔹 CREATE exercise
export const createExercise = async (name, workoutId, userId) => {
  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }

  await query("BEGIN");
  try {
    // next order
    const maxRes = await query(
      "SELECT COALESCE(MAX(exercise_order), 0) AS max_order FROM workout_exercises WHERE workout_id = $1",
      [workoutId]
    );
    const nextOrder = maxRes.rows[0].max_order + 1;

    // create exercise
    const res = await query(
      "INSERT INTO exercises (name) VALUES ($1) RETURNING *",
      [name]
    );
    const exerciseId = res.rows[0].id;

    // create workout_exercise
    const weRes = await query(
      `INSERT INTO workout_exercises (workout_id, exercise_id, exercise_order)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [workoutId, exerciseId, nextOrder]
    );
    const workoutExerciseId = weRes.rows[0].id;

    await query("COMMIT");

    return await getExerciseByWorkoutExerciseId(workoutExerciseId);

  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
};

// 🔹 UPDATE exercise
export const updateExercise = async (name, workoutId, workoutExerciseId, userId) => {
  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }
  if (!(await doesWorkoutHaveWorkoutExerciseId(workoutId, workoutExerciseId))) {
    throw { statusCode: 404, message: "Workout exercise not found" };
  }

  const exerciseId = await getExerciseId(workoutExerciseId);

  await query(
    "UPDATE exercises SET name = $1 WHERE id = $2",
    [name, exerciseId]
  );

  return await getExerciseByWorkoutExerciseId(workoutExerciseId);
};

// 🔹 DELETE exercise
export const deleteExercise = async (workoutId, workoutExerciseId, userId) => {
  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }
  if (!(await doesWorkoutHaveWorkoutExerciseId(workoutId, workoutExerciseId))) {
    throw { statusCode: 404, message: "Workout exercise not found" };
  }

  await query("BEGIN");
  try {
    const exerciseId = await getExerciseId(workoutExerciseId);

    await query("DELETE FROM workout_exercises WHERE id = $1", [workoutExerciseId]);
    await query("DELETE FROM exercises WHERE id = $1", [exerciseId]);

    await query("COMMIT");
    return { message: "Exercise deleted successfully" };

  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
};

// 🔹 UPDATE rest times
export const updateRestTimes = async (fields, workoutId, workoutExerciseId, userId) => {
  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }
  if (!(await doesWorkoutHaveWorkoutExerciseId(workoutId, workoutExerciseId))) {
    throw { statusCode: 404, message: "Workout exercise not found" };
  }

  const setClauses = [];
  const values = [];
  let i = 1;

  for (const key in fields) {
    if (fields[key] != null) {
      setClauses.push(`${key} = $${i}`);
      values.push(fields[key]);
      i++;
    }
  }

  if (!setClauses.length) return null;

  values.push(workoutId, workoutExerciseId);

  const queryText = `
    UPDATE workout_exercises
    SET ${setClauses.join(', ')}
    WHERE workout_id = $${i} AND id = $${i + 1}
    RETURNING *;
  `;

  const { rows } = await query(queryText, values);
  if (!rows.length) throw { statusCode: 404, message: "Workout exercise not found" };

  return rows[0];
};

// 🔹 UPDATE exercise type
export const updateExerciseType = async (type, workoutId, workoutExerciseId, userId) => {
  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }
  if (!(await doesWorkoutHaveWorkoutExerciseId(workoutId, workoutExerciseId))) {
    throw { statusCode: 404, message: "Workout exercise not found" };
  }

  const { rows } = await query(`
    UPDATE workout_exercises
    SET type = $1
    WHERE workout_id = $2 AND id = $3
    RETURNING *;
  `, [type, workoutId, workoutExerciseId]);

  if (!rows.length) throw { statusCode: 404, message: "Workout exercise not found" };

  return rows[0];
};

// 🔹 SWAP exercises
export const swapExercises = async (workoutId, sourceId, targetId, userId) => {
  // 🔐 Auth checks
  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    throw { statusCode: 403, message: "Access denied" };
  }

  if (!(await doesWorkoutHaveWorkoutExerciseId(workoutId, sourceId))) {
    throw { statusCode: 404, message: "Source workout exercise not found" };
  }

  if (!(await doesWorkoutHaveWorkoutExerciseId(workoutId, targetId))) {
    throw { statusCode: 404, message: "Target workout exercise not found" };
  }

  const client = await query; // assuming pg pool wrapper supports this

  console.log('BEGUN!!!!!!!!!!!!!!')
  await query("BEGIN");

  try {
    // 📦 Get both exercise orders
    const { rows } = await query(
      `
      SELECT id, exercise_order
      FROM workout_exercises
      WHERE workout_id = $1 AND id IN ($2, $3)
      `,
      [workoutId, sourceId, targetId]
    );

    if (rows.length !== 2) {
      throw { statusCode: 404, message: "Workout exercise not found" };
    }

    const source = rows.find(r => r.id === sourceId);
    const target = rows.find(r => r.id === targetId);

    const sourceOrder = Number(source.exercise_order);
    const targetOrder = Number(target.exercise_order);

    if (sourceOrder === targetOrder) {
      await query("COMMIT");
      return { success: true };
    }

    // STEP 1: move source to a temporary safe value
    await query(
      `
      UPDATE workout_exercises
      SET exercise_order = -1
      WHERE id = $1 AND workout_id = $2
      `,
      [sourceId, workoutId]
    );

    const min = Math.min(sourceOrder, targetOrder);
    const max = Math.max(sourceOrder, targetOrder);

    const order = sourceOrder < targetOrder ? 'ASC' : 'DESC';

    // STEP 2: shift all exercises between source and target in the opposite direction
    let res = await query(
      `SELECT id, exercise_order
      FROM workout_exercises
      WHERE exercise_order BETWEEN $1 AND $2
      AND workout_id = $3
      ORDER BY exercise_order ${order}`,
      [min, max, workoutId]
    );

    console.log(res.rows);

    const operator = sourceOrder < targetOrder ? '-' : '+';

    for (const row of res.rows) {
      await query(
        `
        UPDATE workout_exercises
        SET exercise_order = exercise_order ${operator} 1
        WHERE id = $1 AND workout_id = $2
        `,
        [row.id, workoutId]
      );
    }

    // STEP 3: move source into target position
    await query(
      `
      UPDATE workout_exercises
      SET exercise_order = $1
      WHERE id = $2 AND workout_id = $3
      `,
      [targetOrder, sourceId, workoutId]
    );

    console.log('STEP 3 DONE')

    await query("COMMIT");

    return { success: true };

  } catch (err) {
    await query("ROLLBACK");
    throw err;
  }
};