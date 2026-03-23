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

    const getSession = useCallback(async () => {
        return withLoadingAndError(setLoading, setError, async () => {
            const result = await getSessionApi();

            setSession(result.error ? null : (result.session || null));

            return result.session || null;
        })();
    }, []);

    const startSession = useCallback(async (workoutId) => {
        return withLoadingAndError(setLoading, setError, async () => {
            const result = await startSessionApi(workoutId);

            if (!result.error) {
                setSession(result.session);
            }

            return result;
        })();
    }, []);

    const updateProgress = useCallback(
        async (sessionId, workout_exercise_id, setNumber, reps, weight) => {
            return withLoadingAndError(setLoading, setError, async () => {
                const result = await updateProgressApi(
                    sessionId,
                    workout_exercise_id,
                    setNumber,
                    reps,
                    weight,
                );

                if (!result.error) {
                    setSession(result.session);
                }

                return result;
            })();
        },
        []
    );

    const endSession = useCallback(
        async (status, sessionId) => {
            return withLoadingAndError(setLoading, setError, async () => {
                const result = await endSessionApi(status, sessionId);

                if (!result.error) {
                    setSession(null);
                }

                return result;
            })();
        },
        []
    );

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