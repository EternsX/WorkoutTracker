import express from 'express';
import {
    getExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    updateRestTimes,
    updateExerciseType
} from '../controllers/exercises.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/', authMiddleware, getExercises);
router.post('/', authMiddleware, createExercise);
router.put('/:workoutExerciseId', authMiddleware, updateExercise);
router.delete('/:workoutExerciseId', authMiddleware, deleteExercise);
router.patch('/:workoutExerciseId/rest', authMiddleware, updateRestTimes);
router.patch('/:workoutExerciseId/type', authMiddleware, updateExerciseType);

export default router;