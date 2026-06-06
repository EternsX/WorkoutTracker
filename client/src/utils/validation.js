export function requireFields(fields) {
  const errors = {};

  for (const key in fields) {
    if (fields[key] == null || fields[key] === "") {
      errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
    }
  }

  return errors;
}

export function validationError(errors) {
  return {
    message: "Validation failed",
    code: "VALIDATION_ERROR",
    statusCode: 400,
    errors
  };
}