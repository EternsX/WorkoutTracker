import { useState, useCallback, useMemo } from "react";
import ProgressContext from "./ProgressContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import {
    getBestSetApi,
    getVolumeApi
} from "./progressApi";

export default function ProgressProvider({ children }) {
    const [bestSetProgress, setBestSetProgress] = useState([]);
    const [volume, setVolume] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- BEST SET ---
    const getBestSet = useCallback(async (workout_exercise_id) => {
        return withLoadingAndError(setLoading, setError, async () => {
            const result = await getBestSetApi(workout_exercise_id);

            if (!result.error) {
                setBestSetProgress(result || []);
            }

            return result || [];
        })();
    }, []);

    // --- VOLUME ---
    const getVolume = useCallback(async () => {
        return withLoadingAndError(setLoading, setError, async () => {
            const result = await getVolumeApi();

            if (!result.error) {
                setVolume(result.volume || []);
            }

            return result.volume || [];
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