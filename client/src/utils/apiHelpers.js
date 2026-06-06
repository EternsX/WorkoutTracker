export function withLoadingAndError(setLoading, setError, asyncFn) {
  return async (...args) => {
    setError(null);
    setLoading(true);

    try {
      return await asyncFn(...args);
    } catch (err) {
      console.log("withLoadingAndError err:", err);
      setError(err);
      return err;
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
      message: data.message,
      key: data.key,
      code: data.code,
      errors: data.errors,
      statusCode: res.status
    };
  }

  return data;
};
