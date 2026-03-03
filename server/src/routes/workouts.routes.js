import express from 'express';
import {
    getWorkouts,
    updateWorkout,
    deleteWorkout,
    createWorkout
} from '../controllers/workouts.controller.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getWorkouts);
router.post('/', authMiddleware, createWorkout);
router.put('/:workoutId', authMiddleware, updateWorkout);
router.delete('/:workoutId', authMiddleware, deleteWorkout);

export default router;