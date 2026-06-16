import { useState, useCallback, useMemo, useEffect } from "react";
import AuthContext from "./AuthContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import { requireFields } from "../../utils/validation";
import { fetchUserApi, loginApi, registerApi, verifyApi, updateEmailApi, updateUsernameApi, deleteAccountApi } from "./authApi";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const login = useCallback((usernameOrEmail, password) => {
    return withLoadingAndError(setLoading, setError, async () => {

      const errors = requireFields({ usernameOrEmail, password });
      if (Object.keys(errors).length) throw { errors };

      await loginApi(usernameOrEmail, password);
      const { user } = await fetchUser();

      return { success: true, user };
    })();
  }, [fetchUser]);

  const register = useCallback((username, email, password) => {
    return withLoadingAndError(setLoading, setError, async () => {

      const errors = requireFields({ username, email, password });
      if (Object.keys(errors).length) throw { errors };

      await registerApi(username, email, password);

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

  const verify = useCallback((token) => {
    return withLoadingAndError(setLoading, setError, async () => {
      await verifyApi(token);
      return { success: true };
    })();
  }, []);

  const updateUsername = useCallback((username) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const errors = requireFields({ username });
      if (Object.keys(errors).length) throw { errors };
      await updateUsernameApi(username);
      return { success: true };
    })();
  }, []);

  const updateEmail = useCallback((email) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const errors = requireFields({ email });
      if (Object.keys(errors).length) throw { errors };
      console.log("Going to update email to:", email)
      await updateEmailApi(email);
      console.log("Email update successful")
      return { success: true };
    })();
  }, []);

  const deleteAccount = useCallback(() => {
    return withLoadingAndError(setLoading, setError, async () => {
      await deleteAccountApi();
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
    logout,
    verify,
    updateUsername,
    updateEmail,
    deleteAccount
  }), [user, loading, error, fetchUser, login, register, logout, verify, updateUsername, updateEmail, deleteAccount]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}