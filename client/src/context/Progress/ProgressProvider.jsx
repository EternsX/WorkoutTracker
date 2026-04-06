import { useState, useCallback, useMemo } from "react";
import ProgressContext from "./ProgressContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import { getBestSetApi, getVolumeApi } from "./ProgressApi";

export default function ProgressProvider({ children }) {
  const [bestSetProgress, setBestSetProgress] = useState([]);
  const [volume, setVolume] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ GET BEST SET
  const getBestSet = useCallback((workout_exercise_id) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await getBestSetApi(workout_exercise_id);

      setBestSetProgress(result || []);
      return { bestSet: result || [] };
    })();
  }, []);

  // ✅ GET VOLUME
  const getVolume = useCallback(() => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await getVolumeApi();

      setVolume(result.volume || []);
      return { volume: result.volume || [] };
    })();
  }, []);

  const value = useMemo(() => ({
    bestSetProgress,
    volume,
    loading,
    error,
    getBestSet,
    getVolume
  }), [bestSetProgress, volume, loading, error, getBestSet, getVolume]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}