import express from 'express';
import {
    getHistory,
} from '../controllers/history.controller.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getHistory);


export default router;