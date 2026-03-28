import * as setService from '../services/sets.services.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getSets = asyncHandler(async (req, res) => {
    const sets = await setService.getSets(req.params.exerciseId, req.params.workoutId, req.user.id);

    res.status(200).json({ sets });
});

export const createSet = asyncHandler(async (req, res) => {
    let { reps, duration, weight } = req.body;

    reps = reps > 0 ? reps : null;
    duration = duration > 0 ? duration : null;
    weight = weight >= 0 ? weight : null;
    if ((reps == null && duration == null)) {
        const err = new Error("Missing Fields");
        err.statusCode = 400;
        throw err;
    }

    if (reps != null && (!Number.isInteger(reps) || reps <= 0)) {
        const err = new Error("Invalid reps");
        err.statusCode = 400;
        throw err;
    }

    if (duration != null && (!Number.isInteger(duration) || duration <= 0)) {
        const err = new Error("Invalid duration");
        err.statusCode = 400;
        throw err;
    }

    if (weight != null && (isNaN(weight) || weight < 0)) {
        const err = new Error("Invalid weight");
        err.statusCode = 400;
        throw err;
    }

    const set = await setService.createSet(
        reps ?? null,
        duration ?? null,
        weight ?? 0,
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
    let { reps, duration, weight } = req.body;

    // Convert 0 to null for validation purposes
    reps = reps > 0 ? reps : null;
    duration = duration > 0 ? duration : null;
    weight = weight >= 0 ? weight : null;

    // Validate presence
    if (reps == null && duration == null) {
        const err = new Error("Missing Fields");
        err.statusCode = 400;
        throw err;
    }

    if (weight == null) {
        const err = new Error("Weight is required");
        err.statusCode = 400;
        throw err;
    }

    if ((reps != null && !Number.isInteger(reps)) || !Number.isInteger(weight) || (duration != null && !Number.isInteger(duration))) {
        const err = new Error("Invalid numbers");
        err.statusCode = 400;
        throw err;
    }

    // Call service
    const set = await setService.updateSet(
        { reps, duration, weight },
        req.params.setId,
        req.params.exerciseId,
        req.params.workoutId,
        req.user.id
    );

    res.status(200).json({ set });
});