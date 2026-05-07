// src/api/setsApi.js
import { request } from "../../utils/apiHelpers"; // your generic fetch wrapper
import { createSetUrl, delSetUrl, updateSetUrl, getSetsUrl } from "../../api/sets.api";

export const apiGetSets = async (workoutId, workoutExerciseId, signal) => {
  const result = await request(getSetsUrl(workoutId, workoutExerciseId), { signal });
  return result;
};

// ✅ CREATE SET
export const apiCreateSet = async (value, type, weight, workoutId, workoutExerciseId) => {
  const result = await request(createSetUrl(workoutId, workoutExerciseId), {
    method: "POST",
    body: JSON.stringify({ value, type, weight: weight || 0 }),
  });
  return result;
};

// ✅ UPDATE SET
export const apiUpdateSet = async (setId, value, type, weight, workoutId, workoutExerciseId) => {
  const result = await request(updateSetUrl(workoutId, workoutExerciseId, setId), {
    method: "PUT",
    body: JSON.stringify({ value, type, weight: weight || 0 }),
  });
  return result;
};

export const apiDeleteSet = async (setId, workoutId, workoutExerciseId) => {
  const result = await request(delSetUrl(workoutId, workoutExerciseId, setId), {
    method: "DELETE",
  });
  return result;
};