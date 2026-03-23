import * as exerciseService from '../services/exercises.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// GET exercises
export const getExercises = asyncHandler(async (req, res) => {
    const exercises = await exerciseService.getExercises(
        req.params.workoutId,
        req.user.id
    );

    res.status(200).json({ exercises });
});

// CREATE exercise
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

// DELETE exercise
export const deleteExercise = asyncHandler(async (req, res) => {
    const { workoutExerciseId, workoutId } = req.params;

    const result = await exerciseService.deleteExercise(
        workoutId,
        workoutExerciseId,
        req.user.id
    );

    res.status(200).json(result);
});

// UPDATE exercise name
export const updateExercise = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { workoutExerciseId, workoutId } = req.params;

    if (!name) {
        const err = new Error("Missing Fields");
        err.statusCode = 400;
        throw err;
    }

    const exercise = await exerciseService.updateExercise(
        name,
        workoutId,
        workoutExerciseId,
        req.user.id
    );

    res.status(200).json({ exercise });
});

// UPDATE rest times
export const updateRestTimes = asyncHandler(async (req, res) => {
    const { rest_between_sets, rest_after_exercise } = req.body;
    const { workoutExerciseId, workoutId } = req.params;

    if (rest_between_sets == null && rest_after_exercise == null) {
        const err = new Error("Missing Fields");
        err.statusCode = 400;
        throw err;
    }

    const result = await exerciseService.updateRestTimes(
        { rest_between_sets, rest_after_exercise },
        workoutId,
        workoutExerciseId,
        req.user.id
    );

    res.status(200).json({ workoutExercise: result });
});