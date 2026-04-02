import Joi from "joi";

// Params: only workoutExerciseId
export const workoutExerciseParamsSchema = Joi.object({
  workoutExerciseId: Joi.string().uuid().required()
});