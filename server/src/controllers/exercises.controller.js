import * as exerciseService from '../services/exercises.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// GET
export const getExercises = asyncHandler(async (req, res) => {
    const exercises = await exerciseService.getExercises(
        req.params.workoutId,
        req.user.id
    );

    res.status(200).json({ exercises });
});

// CREATE
export const createExercise = asyncHandler(async (req, res) => {
    const exercise = await exerciseService.createExercise(
        req.body.name,
        req.params.workoutId,
        req.user.id
    );

    res.status(201).json({ exercise });
});

// DELETE
export const deleteExercise = asyncHandler(async (req, res) => {
    const result = await exerciseService.deleteExercise(
        req.params.workoutId,
        req.params.workoutExerciseId,
        req.user.id
    );

    res.status(200).json(result);
});

// UPDATE
export const updateExercise = asyncHandler(async (req, res) => {
    const exercise = await exerciseService.updateExercise(
        req.body.name,
        req.body.type,
        req.params.workoutId,
        req.params.workoutExerciseId,
        req.user.id
    );

    res.status(200).json({ exercise });
});

// UPDATE REST
export const updateRestTimes = asyncHandler(async (req, res) => {
    const result = await exerciseService.updateRestTimes(
        req.body,
        req.params.workoutId,
        req.params.workoutExerciseId,
        req.user.id
    );

    res.status(200).json({ workoutExercise: result });
});

// UPDATE TYPE
export const updateExerciseType = asyncHandler(async (req, res) => {
    const result = await exerciseService.updateExerciseType(
        req.body.type.toLowerCase(),
        req.params.workoutId,
        req.params.workoutExerciseId,
        req.user.id
    );

    res.status(200).json({ workoutExercise: result });
});