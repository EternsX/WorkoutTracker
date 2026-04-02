import express from 'express';
import {
    startWorkoutSession,
    getWorkoutSession,
    updateProgress,
    endSession
} from '../controllers/session.controller.js';

import authMiddleware from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';

import {
    updateProgressSchema,
    endSessionSchema,
    sessionParamsSchema
} from "../validators/session.validator.js";

const router = express.Router();

router.use(authMiddleware);

// ✅ clean
router.get('/', getWorkoutSession);

// ✅ validate params here
router.post(
  '/:workoutId/start',
  validate(sessionParamsSchema, "params"),
  startWorkoutSession
);

// ✅ validate params + body
router.put(
  '/:sessionId/progress',
  validate(sessionParamsSchema, "params"),
  validate(updateProgressSchema, "body"),
  updateProgress
);

// ✅ validate params + body
router.post(
  '/:sessionId/end',
  validate(sessionParamsSchema, "params"),
  validate(endSessionSchema, "body"),
  endSession
);

export default router;