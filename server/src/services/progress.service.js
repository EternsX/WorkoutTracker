import { query } from "../config/db.js";

// --- BEST SET PROGRESS (timeline) ---
export const getBestSetProgress = async (workoutExerciseId, userId) => {

  const res = await query(
    `
    SELECT 
      DATE(ws.ended_at) as date,
      MAX(cs.reps) as best_set
    FROM completed_sets cs
    JOIN workout_exercises we ON cs.workout_exercise_id = we.id
    JOIN workout_sessions ws ON cs.session_id = ws.id
    JOIN workouts w ON ws.workout_id = w.id
    WHERE we.id = $1
      AND w.user_id = $2
    GROUP BY DATE(ws.ended_at)
    ORDER BY date;
    `,
    [workoutExerciseId, userId]
  );

  return res.rows;
};

// --- TOTAL VOLUME ---
export const getTotalVolume = async (userId) => {

  const res = await query(
    `
    SELECT 
      DATE(cw.completed_at) as date,
      SUM(cs.reps) as total_reps
    FROM completed_workouts cw
    JOIN completed_sets cs ON cw.session_id = cs.session_id
    WHERE cw.user_id = $1
    GROUP BY DATE(cw.completed_at)
    ORDER BY date;
    `,
    [userId]
  );

  return res.rows;
};