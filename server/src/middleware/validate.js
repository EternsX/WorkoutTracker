export const validate = (schema, property = "body") => (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        const err = new Error("Validation failed");
        err.statusCode = 400;

        const errors = {};
        error.details.forEach(d => {
            const field = d.path.join('.') || "general";
            errors[field] = d.message;
        });

        err.errors = errors; 

        return next(err);
    }

    req[property] = value;
    next();
};