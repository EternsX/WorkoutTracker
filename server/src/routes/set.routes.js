import express from 'express';
import {
    getSets,
    createSet,
    updateSet,
    deleteSet
} from '../controllers/sets.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true }); // mergeParams needed if nested

router.get('/', authMiddleware, getSets);
router.post('/', authMiddleware, createSet);
router.put('/:setId', authMiddleware, updateSet);
router.delete('/:setId', authMiddleware, deleteSet);

export default router;