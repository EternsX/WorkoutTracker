import { request } from "../../utils/apiHelpers";
import { getSessionUrl, startSessionUrl, updateProgressUrl, endSessionUrl } from "../../api/session.api";

export const getSessionApi = () =>
  request(getSessionUrl, { method: "GET" });

export const startSessionApi = (workoutId) =>
  request(startSessionUrl(workoutId), { method: "POST" });

export const updateProgressApi = (
  sessionId,
  workout_exercise_id,
  setNumber,
  reps,
  duration,
  weight,
) =>
  request(updateProgressUrl(sessionId), {
    method: "PUT",
    body: JSON.stringify({
      workout_exercise_id,
      setNumber,
      reps,
      duration,
      weight,
    })
  });

export const endSessionApi = (status = "finished", sessionId) =>
  request(endSessionUrl(sessionId), {
    method: "POST",
    body: JSON.stringify({ status })
  });