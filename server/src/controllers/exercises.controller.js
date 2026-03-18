import * as exerciseService from '../services/exercises.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getExercises = asyncHandler(async (req, res) => {
    const exercises = await exerciseService.getExercises(req.params.workoutId, req.user.id);

    res.status(200).json({ exercises });
});

export const createExercise = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        const err = new Error("Missing Fields");
        err.statusCode = 400;
        throw err;
    }

    const exercise = await exerciseService.createExercise(
        name,
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
    const { name } = req.body;
    if (!name) {
        const err = new Error("Missing Fields");
        err.statusCode = 400;
        throw err;
    }


    const exercise = await exerciseService.updateExercise(
        name,
        req.params.exerciseId,
        req.params.workoutId,
        req.user.id
    );

    res.status(200).json({ exercise });
});

export const updateRestTimes = asyncHandler(async (req, res) => {
    const { rest_between_sets, rest_after_exercise } = req.body;
    const { exerciseId, workoutId } = req.params;

    // At least one field must be provided
    if (rest_between_sets == null && rest_after_exercise == null) {
        const err = new Error("Missing Fields");
        err.statusCode = 400;
        throw err;
    }

    const result = await exerciseService.updateWorkoutExercise(
        workoutId,
        exerciseId,
        { rest_between_sets, rest_after_exercise },
        req.user.id
    );

    res.status(200).json({ workoutExercise: result });
});