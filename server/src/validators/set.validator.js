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
export const createSetSchema = Joi.object({
  type: Joi.string().valid("reps", "time").required(),
  value: Joi.number().integer().min(1).required(), // reps or duration depending on type
  weight: Joi.number().min(0).optional()
});

export const updateSetSchema = Joi.object({
  type: Joi.string().valid("reps", "time").required(),
  value: Joi.number().integer().min(1).required(), // reps or duration depending on type
  weight: Joi.number().min(0).required()
});