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
import { validate } from '../middleware/validate.js';

import {
    workoutParamsSchema,
    workoutExerciseParamsSchema,
    createExerciseSchema,
    updateExerciseSchema,
    updateRestTimesSchema,
    updateExerciseTypeSchema
} from '../validators/exercise.validator.js';

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);

router.use(validate(workoutParamsSchema, "params"));

router.get('/', getExercises);

router.post(
    '/',
    validate(createExerciseSchema),
    createExercise
);

router.put(
    '/:workoutExerciseId',
    validate(workoutExerciseParamsSchema, "params"),
    validate(updateExerciseSchema),
    updateExercise
);

router.delete(
    '/:workoutExerciseId',
    validate(workoutExerciseParamsSchema, "params"),
    deleteExercise
);

router.patch(
    '/:workoutExerciseId/rest',
    validate(workoutExerciseParamsSchema, "params"),
    validate(updateRestTimesSchema),
    updateRestTimes
);

router.patch(
    '/:workoutExerciseId/type',
    validate(workoutExerciseParamsSchema, "params"),
    validate(updateExerciseTypeSchema),
    updateExerciseType
);

export default router;