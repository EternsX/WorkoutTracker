export const errorMiddleware = (err, req, res, next) => {
    console.error(err); // for debugging/logging

    // If we have a structured errors object (like from validate)
    if (err.errors) {
        return res.status(err.statusCode || 400).json({
            errors: err.errors
        });
    }

    // Fallback for other errors
    return res.status(err.statusCode || 500).json({
        errors: {
            general: err.message || "Server error"
        }
    });
};