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

  const getSets = useCallback(async (workoutId, exerciseId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await apiGetSets(workoutId, exerciseId);

      if (result.error) {
        setSets((prev) => ({
          ...prev,
          [exerciseId]: []
        }));
        return result;
      }

      setSets((prev) => ({
        ...prev,
        [exerciseId]: result.sets || []
      }));

      return result.sets || [];
    })();
  }, []);

  const createSet = useCallback(async (reps, weight, workoutId, exerciseId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await apiCreateSet(reps, weight, workoutId, exerciseId);

      if (!result.error) {
        setSets(prev => ({
          ...prev,
          [exerciseId]: [...(prev[exerciseId] || []), result.set]
        }));
      }

      return result;
    })();
  }, []);

  const updateSet = useCallback(async (setId, reps, weight, workoutId, exerciseId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await apiUpdateSet(setId, reps, weight, workoutId, exerciseId);

      if (!result.error) {
        setSets(prev => ({
          ...prev,
          [exerciseId]: prev[exerciseId].map(s =>
            s.id === setId ? result.set : s
          )
        }));
      }

      return result;
    })();
  }, []);

  const deleteSet = useCallback(async (setId, workoutId, exerciseId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await apiDeleteSet(setId, workoutId, exerciseId);

      if (!result.error) {
        setSets(prev => ({
          ...prev,
          [exerciseId]: prev[exerciseId].filter(s => s.id !== setId)
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