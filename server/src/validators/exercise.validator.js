import Joi from "joi";

// --- Params ---
// Used in routes like /workouts/:workoutId/exercises/:workoutExerciseId
export const workoutParamsSchema = Joi.object({
  workoutId: Joi.string().uuid().required()
});

export const workoutExerciseParamsSchema = Joi.object({
  workoutId: Joi.string().uuid().required(),
  workoutExerciseId: Joi.string().uuid().required()
});

// --- Body ---
// Creating an exercise
export const createExerciseSchema = Joi.object({
  name: Joi.string().min(1).required()
});

// Updating an exercise
export const updateExerciseSchema = Joi.object({
  name: Joi.string().min(1).required(),
  type: Joi.string().valid("reps", "duration").required()
});

// Updating rest times
export const updateRestTimesSchema = Joi.object({
  rest_between_sets: Joi.number().min(0),
  rest_after_exercise: Joi.number().min(0)
}).or("rest_between_sets", "rest_after_exercise"); // At least one must be present

// Updating exercise type
export const updateExerciseTypeSchema = Joi.object({
  type: Joi.string().valid("reps", "duration").required()
});