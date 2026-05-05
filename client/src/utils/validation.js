export function requireFields(fields) {
  const errors = {};

  for (const key in fields) {
    if (fields[key] == null || fields[key] === "") {
      errors[key] = `${key} is required`;
    }
  }

  return errors;
}