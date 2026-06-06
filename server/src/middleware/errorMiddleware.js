export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    console.error("ERROR:", err);

    res.status(statusCode).json({
        message: err.message || "Server error",
        key: err.key || null,
        code: err.code || null,
        errors: err.errors ?? undefined
    });
};