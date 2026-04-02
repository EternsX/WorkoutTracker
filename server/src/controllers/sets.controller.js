import * as setService from '../services/sets.services.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// GET
export const getSets = asyncHandler(async (req, res) => {
  const sets = await setService.getSets(
    req.params.workoutId,
    req.params.exerciseId,
    req.user.id
  );
  res.status(200).json({ sets });
});

// CREATE
export const createSet = asyncHandler(async (req, res) => {
  const { reps, duration, weight } = req.body;

  const set = await setService.createSet(
    reps ?? null,
    duration ?? null,
    weight ?? 0,
    req.params.exerciseId,
    req.params.workoutId,
    req.user.id
  );

  res.status(201).json({ set });
});

// UPDATE
export const updateSet = asyncHandler(async (req, res) => {
  const { reps, duration, weight } = req.body;

  const set = await setService.updateSet(
    { reps, duration, weight },
    req.params.setId,
    req.params.exerciseId,
    req.params.workoutId,
    req.user.id
  );

  res.status(200).json({ set });
});

// DELETE
export const deleteSet = asyncHandler(async (req, res) => {
  const set = await setService.deleteSet(
    req.params.setId,
    req.params.exerciseId,
    req.params.workoutId,
    req.user.id
  );

  res.status(200).json({ set });
});