import express from 'express';
import {
    getExercises,
    createExercise,
    updateExercise,
    deleteExercise,
    updateRestTimes
} from '../controllers/exercises.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true }); // mergeParams needed if nested

router.get('/', authMiddleware, getExercises);
router.post('/', authMiddleware, createExercise);
router.put('/:exerciseId', authMiddleware, updateExercise);
router.delete('/:exerciseId', authMiddleware, deleteExercise);
router.patch('/:exerciseId/rest', authMiddleware, updateRestTimes);

export default router;