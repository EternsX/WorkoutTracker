import * as workoutService from '../services/workouts.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getWorkouts = asyncHandler(async (req, res) => {
    const workouts = await workoutService.getWorkouts(req.user.id);

    res.status(200).json({ workouts });
});

export const createWorkout = asyncHandler(async (req, res) => {
    const { workoutName } = req.body;

    if (!workoutName) {
        const err = new Error("Workout name is required");
        err.statusCode = 400;
        throw err;
    }

    const workout = await workoutService.createWorkout(
        workoutName,
        req.user.id
    );

    res.status(201).json({ workout });
});

export const deleteWorkout = asyncHandler(async (req, res) => {
    const { workoutId } = req.params;

    const workout = await workoutService.deleteWorkout(
        workoutId,
        req.user.id
    );

    res.status(200).json({ workout });
});

export const updateWorkout = asyncHandler(async (req, res) => {
    const { workoutId } = req.params;
    const { workoutName } = req.body;

    if (!workoutName) {
        const err = new Error("Missing workout name");
        err.statusCode = 400;
        throw err;
    }

    const workout = await workoutService.updateWorkout(
        workoutName,
        workoutId,
        req.user.id
    );

    res.status(200).json({ workout });
});