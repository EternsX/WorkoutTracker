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

export async function request(url, options = {}) {
    try {
        const res = await fetch(url, {
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            ...options
        });

        let data = {};

        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            data = await res.json();
        }

        if (!res.ok) {
            return { error: data.error || "Request failed" };
        }

        return data;

    } catch (err) {
        return { error: err.message || "Network error" };
    }
}