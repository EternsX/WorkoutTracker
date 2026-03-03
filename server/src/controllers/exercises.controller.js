import * as exerciseService from '../services/exercises.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getExercises = asyncHandler(async (req, res) => {
    const exercises = await exerciseService.getExercises(req.params.workoutId, req.user.id);

    res.status(200).json({ exercises });
});

export const createExercise = asyncHandler(async (req, res) => {
    const { exerciseName, sets, reps } = req.body;

    if (!exerciseName || sets == null || reps == null) {
        const err = new Error("Missing Fields");
        err.statusCode = 400;
        throw err;
    }

    const exercise = await exerciseService.createExercise(
        exerciseName,
        sets, 
        reps,
        req.params.workoutId,
        req.user.id
    );

    res.status(201).json({ exercise });
});

export const deleteExercise = asyncHandler(async (req, res) => {
    const exercise = await exerciseService.deleteExercise(
        req.params.exerciseId,
        req.params.workoutId,
        req.user.id
    );

    res.status(200).json({ exercise });
});

export const updateExercise = asyncHandler(async (req, res) => {
    const { exerciseName, sets, reps } = req.body;

    if (!exerciseName || sets == null || reps == null) {
        const err = new Error("Missing Fields");
        err.statusCode = 400;
        throw err;
    }

    const exercise = await exerciseService.updateExercise(
        exerciseName,
        sets,
        reps,
        req.params.exerciseId,
        req.params.workoutId,
        req.user.id
    );

    res.status(200).json({ exercise });
});