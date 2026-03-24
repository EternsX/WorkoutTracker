import { useState, useCallback, useMemo } from "react";
import ExerciseContext from "./ExerciseContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import {
  getExercisesApi,
  createExerciseApi,
  updateExerciseApi,
  deleteExerciseApi,
  updateRestTimersApi
} from "./exercisesApi";

export default function ExerciseProvider({ children }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ GET EXERCISES (these are workout_exercises now)
  const getExercises = useCallback(async (workoutId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await getExercisesApi(workoutId);

      if (result.error) {
        setExercises([]);
        return result;
      }

      setExercises(result.exercises || []);
      return result.exercises || [];
    })();
  }, []);

  // ✅ CREATE EXERCISE (creates workout_exercise)
  const createExercise = useCallback(async (name, workoutId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await createExerciseApi(name, workoutId);

      if (!result.error) {
        setExercises(prev => [...prev, result.exercise]);
      }

      return result;
    })();
  }, []);

  // ✅ UPDATE EXERCISE (use workout_exercise_id)
  const updateExercise = useCallback(async (name, workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await updateExerciseApi(name, workoutId, workout_exercise_id);
      if (!result.error) {
        setExercises(prev =>
          prev.map(e =>
            e.workout_exercise_id === workout_exercise_id
              ? result.exercise
              : e
          )
        );
      }

      return result;
    })();
  }, []);

  // ✅ DELETE EXERCISE (use workout_exercise_id)
  const delExercise = useCallback(async (workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      console.log(workout_exercise_id)
      const result = await deleteExerciseApi(workoutId, workout_exercise_id);

      if (!result.error) {
        setExercises(prev =>
          prev.filter(e => e.workout_exercise_id !== workout_exercise_id)
        );
      }

      return result;
    })();
  }, []);

  // ✅ GET SINGLE EXERCISE
  const getExercise = useCallback((workout_exercise_id) => {
    return exercises.find(e => e.workout_exercise_id === workout_exercise_id) || null;
  }, [exercises]);

  // ✅ UPDATE REST TIMERS
  const updateRestTimers = useCallback((restFields, workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await updateRestTimersApi(restFields, workoutId, workout_exercise_id);

      if (!result.error) {
        setExercises(prev =>
          prev.map(e =>
            e.workout_exercise_id !== workout_exercise_id
              ? e
              : { ...e, ...restFields }
          )
        );
      }

      return result;
    })();
  }, []);

  const value = useMemo(() => ({
    exercises,
    loading,
    error,
    getExercises,
    createExercise,
    updateExercise,
    updateRestTimers,
    delExercise,
    getExercise
  }), [
    exercises,
    loading,
    error,
    getExercises,
    createExercise,
    updateExercise,
    updateRestTimers,
    delExercise,
    getExercise
  ]);

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
}