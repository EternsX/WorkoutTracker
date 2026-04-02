import express from 'express';
import {
  getSets,
  createSet,
  updateSet,
  deleteSet
} from '../controllers/sets.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  workoutExerciseParamsSchema,
  setParamsSchema,
  createSetSchema,
  updateSetSchema
} from '../validators/set.validator.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

// GET / sets
router.get(
  '/',
  validate(workoutExerciseParamsSchema, 'params'),
  getSets
);

// POST / sets
router.post(
  '/',
  validate(workoutExerciseParamsSchema, 'params'),
  validate(createSetSchema),
  createSet
);

// PUT / sets/:setId
router.put(
  '/:setId',
  validate(setParamsSchema, 'params'),
  validate(updateSetSchema),
  updateSet
);

// DELETE / sets/:setId
router.delete(
  '/:setId',
  validate(setParamsSchema, 'params'),
  deleteSet
);

export default router;