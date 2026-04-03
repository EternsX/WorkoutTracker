import Joi from "joi";

export const startSessionSchema = Joi.object({
  workoutId: Joi.string().uuid().required()
});

// --- Params ---
// Optional workoutId (for starting session), sessionId required
export const sessionParamsSchema = Joi.object({
  sessionId: Joi.string().uuid().required(),
  workoutId: Joi.string().uuid().optional()
});

// --- Body ---
// Update progress for a set within a workout session
export const updateProgressSchema = Joi.object({
  workout_exercise_id: Joi.string().uuid().required(),
  setNumber: Joi.number().min(0).required(),
  reps: Joi.number().min(0),
  duration: Joi.number().min(0),
  weight: Joi.number().min(0).required()
}).or("reps", "duration"); // At least one of reps or duration must be provided

// End a workout session
export const endSessionSchema = Joi.object({
  status: Joi.string().valid("FINISHED", "DISCARDED").required()
});