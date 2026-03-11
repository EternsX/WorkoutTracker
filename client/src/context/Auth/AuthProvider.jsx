import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { fetchUserApi, loginApi, registerApi, logoutApi } from "./authApi";
import { withLoadingAndError } from ".../../utils/apiHelpers";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = withLoadingAndError(setLoading, setError, async () => {
    const { data, error } = await fetchUserApi();
    if (error) {
      setUser(null);
      return { error };
    }
    setUser(data.user);
    return { success: true };
  });

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = withLoadingAndError(setLoading, setError, async (username, password) => {
    const { error } = await loginApi(username, password);
    if (error) return { error };

    await fetchUser();
    return { success: true };
  });

  const register = withLoadingAndError(setLoading, setError, async (username, password) => {
    const { error } = await registerApi(username, password);
    if (error) return { error };

    const loginRes = await login(username, password);
    if (!loginRes?.success) return { error: loginRes?.error || "Login after register failed" };

    return { success: true };
  });

  const logout = withLoadingAndError(setLoading, setError, async () => {
    await logoutApi();
    setUser(null);
    return { success: true };
  });

  return (
    <AuthContext.Provider value={{ user, loading, error, fetchUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}