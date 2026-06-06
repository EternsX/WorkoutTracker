class AppError extends Error {
    constructor(message, key = null, code = null, statusCode = 400) {
        super(message);
        this.key = key;
        this.code = code;
        this.statusCode = statusCode;

        Error.captureStackTrace?.(this, this.constructor);
    }
}

export default AppError;