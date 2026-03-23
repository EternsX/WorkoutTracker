import { useState, useCallback, useMemo } from "react";
import SetContext from "./SetContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import {
  apiGetSets,
  apiCreateSet,
  apiUpdateSet,
  apiDeleteSet
} from "./setsApi";

export default function SetProvider({ children }) {
  const [sets, setSets] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ GET SETS
  const getSets = useCallback(async (workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await apiGetSets(workoutId, workout_exercise_id);
      setSets(prev => ({
        ...prev,
        [workoutId]: {
          ...(prev[workoutId] || {}),
          [workout_exercise_id]: result.error ? [] : (result.sets || [])
        }
      }));

      return result.sets || [];
    })();
  }, []);

  // ✅ CREATE SET
  const createSet = useCallback(async (reps, weight, workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await apiCreateSet(reps, weight, workoutId, workout_exercise_id);

      if (!result.error) {
        setSets(prev => ({
          ...prev,
          [workoutId]: {
            ...(prev[workoutId] || {}),
            [workout_exercise_id]: [
              ...(prev[workoutId]?.[workout_exercise_id] || []),
              result.set
            ]
          }
        }));
      }

      return result;
    })();
  }, []);

  // ✅ UPDATE SET
  const updateSet = useCallback(async (setId, reps, weight, workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await apiUpdateSet(setId, reps, weight, workoutId, workout_exercise_id);

      if (!result.error) {
        setSets(prev => ({
          ...prev,
          [workoutId]: {
            ...(prev[workoutId] || {}),
            [workout_exercise_id]: prev[workoutId]?.[workout_exercise_id]?.map(s =>
              s.id === setId ? result.set : s
            ) || []
          }
        }));
      }

      return result;
    })();
  }, []);

  // ✅ DELETE SET
  const deleteSet = useCallback(async (setId, workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await apiDeleteSet(setId, workoutId, workout_exercise_id);

      if (!result.error) {
        setSets(prev => ({
          ...prev,
          [workoutId]: {
            ...(prev[workoutId] || {}),
            [workout_exercise_id]: prev[workoutId]?.[workout_exercise_id]?.filter(
              s => s.id !== setId
            ) || []
          }
        }));
      }

      return result;
    })();
  }, []);

  const value = useMemo(() => ({
    sets,
    loading,
    error,
    getSets,
    createSet,
    updateSet,
    deleteSet
  }), [sets, loading, error, getSets, createSet, updateSet, deleteSet]);

  return (
    <SetContext.Provider value={value}>
      {children}
    </SetContext.Provider>
  );
}