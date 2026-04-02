// session.service.js
import { query, getClient } from '../config/db.js';
import { 
  doesUserOwnWorkout,
  getSessionOrThrowIfNotOwned,
  doesWorkoutHaveWorkoutExerciseId
} from '../config/validations.js';

/**
 * Start a new workout session
 */
export const startWorkoutSession = async (workoutId, userId) => {
  if (!(await doesUserOwnWorkout(userId, workoutId))) {
    const err = new Error("Access denied");
    err.statusCode = 403;
    throw err;
  }

  const res = await query(
    `INSERT INTO workout_sessions (user_id, workout_id, status)
     VALUES ($1, $2, 'active')
     RETURNING id, user_id, workout_id, started_at, status`,
    [userId, workoutId]
  );

  return res.rows[0];
};

/**
 * Get the active workout session for a user
 */
export const getWorkoutSession = async (userId) => {
  const res = await query(
    `SELECT * FROM workout_sessions 
     WHERE user_id = $1 AND status = 'active' 
     LIMIT 1`,
    [userId]
  );

  return res.rows[0] || null;
};

/**
 * Update session progress
 */
export const updateProgress = async (sessionId, userId, workout_exercise_id, setNumber, reps, duration, weight) => {
  // 1️⃣ Validate session ownership
  const session = await getSessionOrThrowIfNotOwned(sessionId, userId);

  // 2️⃣ Validate exercise belongs to this workout
  if (!(await doesWorkoutHaveWorkoutExerciseId(session.workout_id, workout_exercise_id))) {
    const err = new Error("Exercise does not belong to this workout");
    err.statusCode = 400;
    throw err;
  }

  const client = await getClient();
  try {
    await client.query("BEGIN");

    // 3️⃣ Update session progress as JSON
    const progress = { workout_exercise_id, setNumber };
    const sessionRes = await client.query(
      `UPDATE workout_sessions
       SET progress = $3::jsonb,
           last_activity = NOW()
       WHERE id = $1 AND user_id = $2 AND status = 'active'
       RETURNING *`,
      [sessionId, userId, progress]
    );

    if (!sessionRes.rows.length) {
      const err = new Error("Session not found");
      err.statusCode = 404;
      throw err;
    }

    // 4️⃣ Record the completed set
    await client.query(
      `INSERT INTO completed_sets
           (session_id, workout_exercise_id, set_number, reps, duration, weight, completed_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [sessionId, workout_exercise_id, setNumber, reps, duration, weight]
    );

    await client.query("COMMIT");
    return sessionRes.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Finish or discard a workout session
 */
export const endSession = async (sessionId, userId, status) => {
  // 1️⃣ Validate session ownership
  await getSessionOrThrowIfNotOwned(sessionId, userId);

  const res = await query(
    `UPDATE workout_sessions
     SET status = $3, ended_at = NOW()
     WHERE id = $1 AND user_id = $2 AND status = 'active'
     RETURNING *`,
    [sessionId, userId, status]
  );

  if (!res.rows.length) {
    const err = new Error("Session not found or already finished");
    err.statusCode = 404;
    throw err;
  }

  return res.rows[0];
};