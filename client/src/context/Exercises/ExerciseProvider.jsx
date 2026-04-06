import { useState, useCallback, useMemo } from "react";
import ExerciseContext from "./ExerciseContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import { requireFields } from "../../utils/validation";
import {
  getExercisesApi,
  createExerciseApi,
  updateExerciseApi,
  deleteExerciseApi,
  updateRestTimersApi,
  updateExerciseTypeApi
} from "./exercisesApi";

export default function ExerciseProvider({ children }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ GET EXERCISES
  const getExercises = useCallback((workoutId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await getExercisesApi(workoutId);

      setExercises(result.exercises || []);
      return { exercises: result.exercises || [] };
    })();
  }, []);

  // ✅ CREATE EXERCISE
  const createExercise = useCallback((name, workoutId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const errors = requireFields({ name });
      if (Object.keys(errors).length) throw { errors };

      const result = await createExerciseApi(name, workoutId);

      setExercises(prev => [...prev, result.exercise]);

      return { success: true, exercise: result.exercise };
    })();
  }, []);

  // ✅ UPDATE EXERCISE
  const updateExercise = useCallback((name, workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const errors = requireFields({ name });
      if (Object.keys(errors).length) throw { errors };

      const result = await updateExerciseApi(name, workoutId, workout_exercise_id);

      setExercises(prev =>
        prev.map(e =>
          e.workout_exercise_id === workout_exercise_id
            ? result.exercise
            : e
        )
      );

      return { success: true, exercise: result.exercise };
    })();
  }, []);

  // ✅ DELETE EXERCISE
  const delExercise = useCallback((workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      await deleteExerciseApi(workoutId, workout_exercise_id);

      setExercises(prev =>
        prev.filter(e => e.workout_exercise_id !== workout_exercise_id)
      );

      return { success: true };
    })();
  }, []);

  // ✅ GET SINGLE EXERCISE (sync)
  const getExercise = useCallback((workout_exercise_id) => {
    return exercises.find(e => e.workout_exercise_id === workout_exercise_id) || null;
  }, [exercises]);

  // ✅ UPDATE REST TIMERS
  const updateRestTimers = useCallback((restFields, workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      await updateRestTimersApi(restFields, workoutId, workout_exercise_id);

      setExercises(prev =>
        prev.map(e =>
          e.workout_exercise_id !== workout_exercise_id
            ? e
            : { ...e, ...restFields }
        )
      );

      return { success: true };
    })();
  }, []);

  // ✅ UPDATE EXERCISE TYPE
  const updateExerciseType = useCallback((type, workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const errors = requireFields({ type });
      if (Object.keys(errors).length) throw { errors };

      await updateExerciseTypeApi(type, workoutId, workout_exercise_id);

      setExercises(prev =>
        prev.map(e =>
          e.workout_exercise_id !== workout_exercise_id
            ? e
            : { ...e, type }
        )
      );

      return { success: true };
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
    getExercise,
    updateExerciseType
  }), [
    exercises,
    loading,
    error,
    getExercises,
    createExercise,
    updateExercise,
    updateRestTimers,
    delExercise,
    getExercise,
    updateExerciseType
  ]);

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
}