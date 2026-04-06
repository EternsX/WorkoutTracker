export function withLoadingAndError(setLoading, setError, asyncFn) {
  return async (...args) => {
    setError(null);
    setLoading(true);

    try {
      return await asyncFn(...args);
    } catch (err) {
      // Ensure we have structured errors
      const errorObj = err.errors || { general: err.message || "Network error" };
      setError(errorObj);
      return { error: errorObj };
    } finally {
      setLoading(false);
    }
  };
}

export const request = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      message: data.message || "Request failed",
      errors: data.errors || { general: data.message || "Request failed" },
      statusCode: res.status
    };
  }

  return data;
};
