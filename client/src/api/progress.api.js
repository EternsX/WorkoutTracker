import { BASE_URL } from "./base_url";

const progressUrl = () =>
  `${BASE_URL}/progress`;

export const bestSetUrl = (workoutExerciseId) =>
`${progressUrl()}/best-set/${workoutExerciseId}`;

export const volumeUrl  = `${progressUrl()}/total-volume`;