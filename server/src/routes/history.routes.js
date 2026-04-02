import express from 'express';
import {
    getHistory,
} from '../controllers/history.controller.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getHistory);


export default router;