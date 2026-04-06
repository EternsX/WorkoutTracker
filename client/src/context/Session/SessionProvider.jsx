import { useState, useCallback, useMemo } from "react";
import SessionContext from "./SessionContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import {
  getSessionApi,
  startSessionApi,
  updateProgressApi,
  endSessionApi
} from "./sessionApi";

export default function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ GET CURRENT SESSION
  const getSession = useCallback(() => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await getSessionApi();
      setSession(result.session || null);
      return { session: result.session || null };
    })();
  }, []);

  // ✅ START SESSION
  const startSession = useCallback((workoutId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await startSessionApi(workoutId);
      setSession(result.session);
      return { session: result.session };
    })();
  }, []);

  // ✅ UPDATE PROGRESS
  const updateProgress = useCallback(
    (sessionId, workout_exercise_id, setNumber, reps, duration, weight) => {
      return withLoadingAndError(setLoading, setError, async () => {
        const result = await updateProgressApi(
          sessionId,
          workout_exercise_id,
          setNumber,
          reps,
          Number(duration),
          weight
        );
        setSession(result.session);
        return { session: result.session };
      })();
    },
    []
  );

  // ✅ END SESSION
  const endSession = useCallback((status, sessionId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      await endSessionApi(status, sessionId);
      setSession(null);
      return { success: true };
    })();
  }, []);

  const value = useMemo(() => ({
    session,
    loading,
    error,
    getSession,
    startSession,
    updateProgress,
    endSession
  }), [session, loading, error, getSession, startSession, updateProgress, endSession]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}