import { request } from "../../utils/apiHelpers";
import { bestSetUrl, volumeUrl } from "../../api/progress.api";

export const getBestSetApi = (workout_exercise_id) =>
  request(bestSetUrl(workout_exercise_id), {
    method: "GET",
  });

export const getVolumeApi = () =>
  request(volumeUrl, {
    method: "GET",
  });