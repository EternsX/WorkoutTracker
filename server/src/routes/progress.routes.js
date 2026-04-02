import express from 'express';
import {
  getBestSetProgress,
  getTotalVolume
} from "../controllers/progress.controller.js";

import authMiddleware from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { workoutExerciseParamsSchema } from '../validators/progress.validator.js';

const router = express.Router();

router.use(authMiddleware);

// ✅ validate params here
router.get(
  '/best-set/:workoutExerciseId',
  validate(workoutExerciseParamsSchema, "params"),
  getBestSetProgress
);

// ❌ no validation needed
router.get('/total-volume', getTotalVolume);

export default router;