import Joi from "joi";

// Params
export const workoutParamsSchema = Joi.object({
  workoutId: Joi.string().uuid().required()
});

// Body
export const createWorkoutSchema = Joi.object({
  name: Joi.string().min(1).required()
});

export const updateWorkoutSchema = Joi.object({
  name: Joi.string().min(1).required()
});

export const completeWorkoutSchema = Joi.object({
  sessionId: Joi.string().uuid().required()
});