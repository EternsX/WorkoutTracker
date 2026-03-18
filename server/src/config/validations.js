export async function validateUser(userId, workoutId) {
    const res = await query(
        'SELECT 1 FROM workouts WHERE id = $1 AND user_id = $2',
        [workoutId, userId]
    );
    return res.rows.length > 0;
}

export async function validateWorkoutExercise(workoutId, exerciseId) {
    const res = await query(
        'SELECT 1 FROM workout_exercises WHERE workout_id = $1 AND exercise_id = $2',
        [workoutId, exerciseId]
    );
    return res.rows.length > 0;
}

export async function validateSet(setId, workoutId, exerciseId) {
    const res = await query(`
        SELECT 1
        FROM sets s
        JOIN workout_exercises we ON s.workout_exercise_id = we.id
        WHERE s.id = $1
        AND we.exercise_id = $2
        AND we.workout_id = $3
    `, [setId, exerciseId, workoutId]);

    return res.rows.length > 0;
}