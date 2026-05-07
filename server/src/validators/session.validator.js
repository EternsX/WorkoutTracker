import Joi from "joi";

export const startSessionSchema = Joi.object({
  workoutId: Joi.string().uuid().required()
});

export const sessionParamsSchema = Joi.object({
  sessionId: Joi.string().uuid().required(),
  workoutId: Joi.string().uuid().optional()
});

export const updateProgressSchema = Joi.object({
  workout_exercise_id: Joi.string().uuid().required(),
  setNumber: Joi.number().min(0).required(),
  reps: Joi.number().min(0),
  duration: Joi.number().min(0),
  weight: Joi.number().min(0).required(),
  restUntil: Joi.date().iso().required()
}).or("reps", "duration"); // At least one of reps or duration must be provided

export const endSessionSchema = Joi.object({
  status: Joi.string().valid("FINISHED", "DISCARDED").required()
});