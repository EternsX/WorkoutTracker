import { useState, useCallback, useMemo } from "react";
import ExerciseContext from "./ExerciseContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import {
  getExercisesApi,
  createExerciseApi,
  updateExerciseApi,
  deleteExerciseApi
} from "./exercisesApi";

export default function ExerciseProvider({ children }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const createExercise = useCallback(async (name, workoutId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await createExerciseApi(name, workoutId);

      if (!result.error) {
        setExercises(prev => [...prev, result.exercise]);
      }

      return result;
    })();
  }, []);

  const updateExercise = useCallback(async (name, workoutId, exerciseId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await updateExerciseApi(name, workoutId, exerciseId);

      if (!result.error) {
        setExercises(prev =>
          prev.map(e => (e.id === exerciseId ? result.exercise : e))
        );
      }

      return result;
    })();
  }, []);

  const delExercise = useCallback(async (workoutId, exerciseId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await deleteExerciseApi(workoutId, exerciseId);

      if (!result.error) {
        setExercises(prev => prev.filter(e => e.id !== exerciseId));
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
    delExercise
  }), [exercises, loading, error, getExercises, createExercise, updateExercise, delExercise]);

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
}