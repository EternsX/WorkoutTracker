import { asyncHandler } from '../middleware/asyncHandler.js';
import * as sessionService from "../services/session.service.js";

export const startWorkoutSession = asyncHandler(async (req, res) => {
    const { workoutId } = req.params;

    const session = await sessionService.startWorkoutSession(
        workoutId,
        req.user.id
    );

    res.status(200).json({ session });
});

// Get active session for a user
export const getWorkoutSession = asyncHandler(async (req, res) => {
    const session = await sessionService.getWorkoutSession(req.user.id);
    res.status(200).json({ session });
});

export const updateProgress = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const { workout_exercise_id, setNumber, reps, duration, weight, restUntil } = req.body;
    console.log(req.body)
    const session = await sessionService.updateProgress(
        sessionId,
        req.user.id,
        workout_exercise_id,
        setNumber,
        reps,
        duration,
        weight,
        restUntil
    );

    res.status(200).json({ session });
});

export const endSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const { status } = req.body;

    const session = await sessionService.endSession(
        sessionId,
        req.user.id,
        status
    );

    res.status(200).json({ session });
});