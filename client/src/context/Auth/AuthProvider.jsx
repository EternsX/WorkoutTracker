import { useState, useEffect, useCallback, useMemo } from "react";
import AuthContext from "./AuthContext";
import { fetchUserApi, loginApi, registerApi } from "./authApi";
import { withLoadingAndError } from "../../utils/apiHelpers";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    return withLoadingAndError(setLoading, setError, async () => {
      const data = await fetchUserApi();

      if (data?.error) {
        localStorage.removeItem("token"); // ✅ REMOVE BAD TOKEN
        setUser(null);
        return data.error;
      }

      setUser(data.user);
      return { success: true };
    })();
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (username, password) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const { error } = await loginApi(username, password);
      if (error) return { error };

      await fetchUser();
      return { success: true };
    })();
  }, [fetchUser]);

  const register = useCallback(async (username, password) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const { error } = await registerApi(username, password);
      if (error) return { error };

      const loginRes = await login(username, password);

      if (!loginRes?.success) {
        return { error: loginRes?.error || "Login after register failed" };
      }

      return { success: true };
    })();
  }, [login]);

  const logout = useCallback(async () => {
    return withLoadingAndError(setLoading, setError, () => {
      localStorage.removeItem("token");
      setUser(null);
    })();
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    fetchUser,
    login,
    register,
    logout
  }), [user, loading, error, fetchUser, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}