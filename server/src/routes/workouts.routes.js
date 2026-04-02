import express from "express";
import {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  completeWorkout
} from "../controllers/workouts.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  workoutParamsSchema,
  createWorkoutSchema,
  updateWorkoutSchema,
  completeWorkoutSchema
} from "../validators/workout.validator.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getWorkouts);

router.post(
  "/",
  validate(createWorkoutSchema),
  createWorkout
);

router.put(
  "/:workoutId",
  validate(workoutParamsSchema, "params"),
  validate(updateWorkoutSchema),
  updateWorkout
);

router.delete(
  "/:workoutId",
  validate(workoutParamsSchema, "params"),
  deleteWorkout
);

router.post(
  "/:workoutId/complete",
  validate(workoutParamsSchema, "params"),
  validate(completeWorkoutSchema),
  completeWorkout
);

export default router;