import express from 'express';
import {
    startWorkoutSession,
    getWorkoutSession,
    updateProgress,
    endSession
} from '../controllers/session.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getWorkoutSession);
router.post('/:workoutId/start', authMiddleware, startWorkoutSession);
router.put('/:sessionId/progress', authMiddleware, updateProgress);
router.post('/:sessionId/end', authMiddleware, endSession);

export default router;