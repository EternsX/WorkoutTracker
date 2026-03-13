import * as setService from '../services/sets.services.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getSets = asyncHandler(async (req, res) => {
    const sets = await setService.getSets(req.params.exerciseId, req.params.workoutId, req.user.id);

    res.status(200).json({ sets });
});

export const createSet = asyncHandler(async (req, res) => {
    const { reps, weight } = req.body;
    if (reps == null || weight == null) {
        const err = new Error("Missing Fields");
        err.statusCode = 400;
        throw err;
    }

    if (!Number.isInteger(reps) ||
        !Number.isInteger(weight) ||
        weight < 0) {
        const err = new Error("Invalid numbers");
        err.statusCode = 400;
        throw err;
    }

    const set = await setService.createSet(
        reps,
        weight,
        req.params.exerciseId,
        req.params.workoutId,
        req.user.id
    );

    res.status(201).json({ set });
});

export const deleteSet = asyncHandler(async (req, res) => {
    const set = await setService.deleteSet(
        req.params.setId,
        req.params.exerciseId,
        req.params.workoutId,
        req.user.id
    );

    res.status(200).json({ set });
});

export const updateSet = asyncHandler(async (req, res) => {
    const { reps, weight } = req.body;
    if (reps == null || weight == null) {
        const err = new Error("Missing Fields");
        err.statusCode = 400;
        throw err;
    }

    if (!Number.isInteger(reps) ||
        !Number.isInteger(weight) ||
        weight < 0) {
        const err = new Error("Invalid numbers");
        err.statusCode = 400;
        throw err;
    }

    const set = await setService.updateSet(
        reps,
        weight,
        req.params.setId,
        req.params.exerciseId,
        req.params.workoutId,
        req.user.id
    );

    res.status(200).json({ set });
});