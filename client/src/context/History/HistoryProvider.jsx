import { useState, useCallback, useMemo } from "react";
import HistoryContext from "./HistoryContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import {
    getHistoryApi,
} from "./historyApi";

export default function HistoryProvider({ children }) {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getHistory = useCallback(async () => {
        return withLoadingAndError(setLoading, setError, async () => {
            const result = await getHistoryApi();

            setHistory(result.error ? null : (result.history || null));
            console.log(result)

            return result.history || null;
        })();
    }, []);

   

    const value = useMemo(() => ({
        history,
        loading,
        error,
        getHistory,
    }), [history, loading, error, getHistory]);

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
}