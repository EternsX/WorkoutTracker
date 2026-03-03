import { useState, useEffect, useCallback } from "react";
import AuthContext from "./AuthContext";
import { user_url, login_url, register_url, logout_url } from "../../api/auth.api";

/*
  Small helper for all API requests
*/
async function request(url, options = {}) {
  try {
    const res = await fetch(url, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      ...options
    });

    const contentType = res.headers.get("content-type");
    let data = null;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    }

    if (!res.ok) {
      return { error: data?.error || "Request failed" };
    }

    return { data };
  } catch (err) {
    return { error: err.message || "Network error" };
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /*
    Get current logged-in user
  */
  const fetchUser = useCallback(async () => {
    const { data, error } = await request(user_url);

    if (error) {
      setUser(null);
      return;
    }

    setUser(data.user);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, [fetchUser]);

  /*
    LOGIN
  */
  const login = async (username, password) => {
    const { error } = await request(login_url, {
      method: "POST",
      body: JSON.stringify({ username, password })
    });

    if (error) return { error };

    await fetchUser();
    return { success: true };
  };

  /*
    REGISTER
  */
  const register = async (username, password) => {
    const { error } = await request(register_url, {
      method: "POST",
      body: JSON.stringify({ username, password })
    });

    if (error) return { error };

    const loginRes = await login(username, password);

    if (!loginRes?.success) {
      return { error: loginRes?.error || "Login after register failed" };
    }

    return { success: true };
  };

  /*
    LOGOUT
  */
  const logout = async () => {
    await request(logout_url);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        fetchUser,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}