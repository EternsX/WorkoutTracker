import * as workoutService from "../services/workouts.service.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import {
  workoutParamsSchema,
  createWorkoutSchema,
  updateWorkoutSchema,
  completeWorkoutSchema
} from "../validators/workout.validator.js";

// GET all workouts
export const getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await workoutService.getWorkouts(req.user.id);
  res.status(200).json({ workouts });
});

// CREATE
export const createWorkout = [
  validate(createWorkoutSchema),
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const workout = await workoutService.createWorkout(name, req.user.id);
    res.status(201).json({ workout });
  })
];

// UPDATE
export const updateWorkout = [
  validate(workoutParamsSchema, "params"),
  validate(updateWorkoutSchema),
  asyncHandler(async (req, res) => {
    const { workoutId } = req.params;
    const { name } = req.body;
    const workout = await workoutService.updateWorkout(name, workoutId, req.user.id);
    res.status(200).json({ workout });
  })
];

// DELETE
export const deleteWorkout = [
  validate(workoutParamsSchema, "params"),
  asyncHandler(async (req, res) => {
    const { workoutId } = req.params;
    const workout = await workoutService.deleteWorkout(workoutId, req.user.id);
    res.status(200).json({ workout });
  })
];

// COMPLETE
export const completeWorkout = [
  validate(workoutParamsSchema, "params"),
  validate(completeWorkoutSchema),
  asyncHandler(async (req, res) => {
    const { workoutId } = req.params;
    const { sessionId } = req.body;
    const workout = await workoutService.completeWorkout(sessionId, workoutId, req.user.id);
    res.status(200).json({ workout });
  })
];