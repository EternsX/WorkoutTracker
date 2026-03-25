export function withLoadingAndError(setLoading, setError, asyncFn) {
  return async (...args) => {
    setError(null);
    setLoading(true);
    try {
      return await asyncFn(...args);
    } catch (err) {
      setError(err.message || "Network error");
      return { error: err.message || "Network error" };
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
    }
  });

  const data = await res.json();
  if (!res.ok) {
    return { error: data.message || "Request failed", status: res.status };
  }
  return data;
};