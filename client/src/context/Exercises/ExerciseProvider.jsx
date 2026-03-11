import { useState } from "react";
import ExerciseContext from "./ExerciseContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import { getExercisesApi, createExerciseApi, updateExerciseApi, deleteExerciseApi } from "./exercisesApi";

export default function ExerciseProvider({ children }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getExercises = withLoadingAndError(setLoading, setError, async (workoutId) => {
    const result = await getExercisesApi(workoutId);
    if (result.error) {
      setExercises([]);
      return result;
    }
    setExercises(result.exercises || []);
    return result.exercises || [];
  });

  const createExercise = withLoadingAndError(setLoading, setError, async (name, workoutId) => {
    const result = await createExerciseApi(name, workoutId);
    if (!result.error) setExercises(prev => [...prev, result.exercise]);
    return result;
  });

  const updateExercise = withLoadingAndError(setLoading, setError, async (name, workoutId, exerciseId) => {
    const result = await updateExerciseApi(name, workoutId, exerciseId);
    if (!result.error) setExercises(prev =>
      prev.map(e => e.id === exerciseId ? result.exercise : e)
    );
    return result;
  });

  const delExercise = withLoadingAndError(setLoading, setError, async (workoutId, exerciseId) => {
    const result = await deleteExerciseApi(workoutId, exerciseId);
    if (!result.error) setExercises(prev => prev.filter(e => e.id !== exerciseId));
    return result;
  });

  return (
    <ExerciseContext.Provider value={{ exercises, loading, error, getExercises, createExercise, updateExercise, delExercise }}>
      {children}
    </ExerciseContext.Provider>
  );
}