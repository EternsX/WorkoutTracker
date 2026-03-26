import * as historyService from '../services/history.service.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getHistory = asyncHandler(async (req, res) => {
    const history = await historyService.getHistory(req.user.id);

    res.status(200).json({ history });
});

