import express from 'express';
import {
    getExercises,
    createExercise,
    updateExercise,
    deleteExercise
} from '../controllers/exercises.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true }); // mergeParams needed if nested

router.get('/exercises', authMiddleware, getExercises);
router.post('/exercises', authMiddleware, createExercise);
router.put('/exercises/:exerciseId', authMiddleware, updateExercise);
router.delete('/exercises/:exerciseId', authMiddleware, deleteExercise);

export default router;