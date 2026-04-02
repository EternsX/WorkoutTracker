import Joi from "joi";

// --- Params ---
export const workoutParamsSchema = Joi.object({
  workoutId: Joi.string().uuid().required()
});

export const workoutExerciseParamsSchema = Joi.object({
  workoutId: Joi.string().uuid().required(),
  exerciseId: Joi.string().uuid().required()
});

export const setParamsSchema = Joi.object({
  workoutId: Joi.string().uuid().required(),
  exerciseId: Joi.string().uuid().required(),
  setId: Joi.string().uuid().required()
});

// --- Body ---
// Create a set
export const createSetSchema = Joi.object({
  reps: Joi.number().integer().min(1).optional(),
  duration: Joi.number().integer().min(1).optional(),
  weight: Joi.number().min(0).optional()
}).or("reps", "duration"); // Must include at least reps or duration

// Update a set
export const updateSetSchema = Joi.object({
  reps: Joi.number().integer().min(1).optional().allow(null),
  duration: Joi.number().integer().min(1).optional().allow(null),
  weight: Joi.number().min(0).required()
}).or("reps", "duration"); // Must include at least reps or duration