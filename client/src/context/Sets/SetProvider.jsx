import { useState } from "react";
import { withLoadingAndError } from "../../utils/apiHelpers";
import { apiGetSets, apiCreateSet, apiUpdateSet, apiDeleteSet } from "./setsApi";

export default function SetProvider({ children }) {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSets = withLoadingAndError(setLoading, setError, async (workoutId, exerciseId) => {
    const result = await apiGetSets(workoutId, exerciseId);
    if (result.error) {
      setSets([]);
      return result;
    }
    setSets(result.sets || []);
    return result.sets || [];
  });

  const createSet = withLoadingAndError(setLoading, setError, async (reps, weight, workoutId, exerciseId) => {
    const result = await apiCreateSet(reps, weight, workoutId, exerciseId);
    if (!result.error) setSets(prev => [...prev, result.set]);
    return result;
  });

  const updateSet = withLoadingAndError(setLoading, setError, async (setId, reps, weight, workoutId, exerciseId) => {
    const result = await apiUpdateSet(setId, reps, weight, workoutId, exerciseId);
    if (!result.error) {
      setSets(prev => prev.map(s => s.id === setId ? result.set : s));
    }
    return result;
  });

  const deleteSet = withLoadingAndError(setLoading, setError, async (setId, workoutId, exerciseId) => {
    const result = await apiDeleteSet(setId, workoutId, exerciseId);
    if (!result.error) setSets(prev => prev.filter(s => s.id !== setId));
    return result;
  });

  return (
    <SetContext.Provider value={{ sets, loading, error, getSets, createSet, updateSet, deleteSet }}>
      {children}
    </SetContext.Provider>
  );
}