import { useState, useCallback, useMemo } from "react";
import SetContext from "./SetContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import { requireFields } from "../../utils/validation";
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
  const getSets = useCallback((workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await apiGetSets(workoutId, workout_exercise_id);

      setSets(prev => ({
        ...prev,
        [workoutId]: {
          ...(prev[workoutId] || {}),
          [workout_exercise_id]: result.sets || []
        }
      }));

      return { sets: result.sets || [] };
    })();
  }, []);

  // ✅ CREATE SET
  // ✅ CREATE SET
const createSet = useCallback(
  (value, type, weight, workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      // Validate input
      const errors = requireFields(type === "reps" ? { reps: value } : { duration: value });
      if (Object.keys(errors).length) throw { errors };
      const result = await apiCreateSet(value, type, weight, workoutId, workout_exercise_id);

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

      return { set: result.set };
    })();
  },
  []
);

// ✅ UPDATE SET
const updateSet = useCallback(
  (setId, value, type, weight, workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      // Validate input
      const errors = requireFields(type === "reps" ? { reps: value, weight } : { duration: value, weight });
      if (Object.keys(errors).length) throw { errors };

      const result = await apiUpdateSet(setId, value, type, weight, workoutId, workout_exercise_id);

      setSets(prev => ({
        ...prev,
        [workoutId]: {
          ...(prev[workoutId] || {}),
          [workout_exercise_id]: prev[workoutId]?.[workout_exercise_id]?.map(s =>
            s.id === setId ? result.set : s
          ) || []
        }
      }));

      return { set: result.set };
    })();
  },
  []
);

  // ✅ DELETE SET
  const deleteSet = useCallback((setId, workoutId, workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      await apiDeleteSet(setId, workoutId, workout_exercise_id);

      setSets(prev => ({
        ...prev,
        [workoutId]: {
          ...(prev[workoutId] || {}),
          [workout_exercise_id]: prev[workoutId]?.[workout_exercise_id]?.filter(
            s => s.id !== setId
          ) || []
        }
      }));

      return { success: true };
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