import { useState, useCallback, useMemo, useEffect } from "react";
import AuthContext from "./AuthContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import { requireFields } from "../../utils/validation";
import { fetchUserApi, loginApi, registerApi } from "./authApi";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(() => {
    return withLoadingAndError(setLoading, setError, async () => {
      try {
        const result = await fetchUserApi();

        setUser(result.user || null);
        return { user: result.user };
      } catch (err) {
        // important: handle invalid token case
        localStorage.removeItem("token");
        setUser(null);
        throw err;
      }
    })();
  }, []);

  const login = useCallback((username, password) => {
    return withLoadingAndError(setLoading, setError, async () => {

      const errors = requireFields({ username, password });
      if (Object.keys(errors).length) throw { errors };

      await loginApi(username, password);
      const { user } = await fetchUser();

      return { success: true, user };
    })();
  }, [fetchUser]);

  const register = useCallback((username, password) => {
    return withLoadingAndError(setLoading, setError, async () => {
      
      const errors = requireFields({ username, password });
      if (Object.keys(errors).length) throw { errors };
      
      await registerApi(username, password);

      // auto-login after registration
      const { user } = await login(username, password);

      return { success: true, user };
    })();
  }, [login]);

  const logout = useCallback(() => {
    return withLoadingAndError(setLoading, setError, async () => {
      localStorage.removeItem("token");
      setUser(null);
      return { success: true };
    })();
  }, []);

  useEffect(() => {
     fetchUser();
  }, [fetchUser]);

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