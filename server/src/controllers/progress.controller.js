import * as progressService from '../services/progress.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// --- BEST SET PROGRESS ---
export const getBestSetProgress = asyncHandler(async (req, res) => {
    const progress = await progressService.getBestSetProgress(
        req.params.workoutExerciseId,
        req.user.id
    );

    console.log("Best set progress:", progress);

    res.status(200).json({ progress });
});

// --- TOTAL VOLUME ---
export const getTotalVolume = asyncHandler(async (req, res) => {
    const volume = await progressService.getTotalVolume(
        req.user.id
    );

    console.log("Total volume:", volume);
    res.status(200).json({ volume });
});