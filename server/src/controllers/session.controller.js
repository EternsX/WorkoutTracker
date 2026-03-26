import { asyncHandler } from '../middleware/asyncHandler.js';
import * as sessionService from "../services/session.service.js";

export const startWorkoutSession = asyncHandler(async (req, res) => {
    const { workoutId } = req.params; // or req.params if you pass it in the URL
    const session = await sessionService.startWorkoutSession(workoutId, req.user.id);
    res.status(200).json({ session });
});

export const getWorkoutSession = asyncHandler(async (req, res) => {
    const session = await sessionService.getWorkoutSession(req.user.id);
    res.status(200).json({ session });
});

export const updateProgress = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const { workout_exercise_id, setNumber, reps, weight } = req.body;

    if (!workout_exercise_id || setNumber == null || reps == null || weight == null) {
        const err = new Error("Missing required fields");
        err.statusCode = 400;
        throw err; 
    }

    const session = await sessionService.updateProgress(
        sessionId,
        req.user.id,
        workout_exercise_id,
        setNumber,
        reps,
        weight,
    );

    res.status(200).json({ session });
});

export const endSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const { status } = req.body; 
    if (!status || !["FINISHED", "DISCARDED"].includes(status)) {
        const err = new Error("Invalid status");
        err.statusCode = 400;
        throw err;
    }

    const session = await sessionService.endSession(sessionId, req.user.id, status);

    res.status(200).json({ session });
});