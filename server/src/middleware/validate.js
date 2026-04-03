export const validate = (schema, property = "body") => (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        console.log(error)
        return res.status(400).json({
            message: "Validation failed",
            errors: error.details.map(d => d.message)
        });
    }

    req[property] = value; // ✅ cleaned data
    next();
};