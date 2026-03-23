import express from 'express';
import {
    getWorkouts,
    updateWorkout,
    deleteWorkout,
    createWorkout,
    completeWorkout,
} from '../controllers/workouts.controller.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getWorkouts);
router.post('/', authMiddleware, createWorkout);
router.put('/:workoutId', authMiddleware, updateWorkout);
router.delete('/:workoutId', authMiddleware, deleteWorkout);
router.post('/:workoutId/complete', authMiddleware, completeWorkout);

export default router;