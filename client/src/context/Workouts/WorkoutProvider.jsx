import { useState, useEffect } from "react";
import WorkoutContext from "./WorkoutContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import { getWorkoutsApi, createWorkoutApi, updateWorkoutApi, deleteWorkoutApi } from "./workoutsApi";
import useAuth from '../Auth/useAuth'

export default function WorkoutProvider({ children }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const getWorkouts = withLoadingAndError(setLoading, setError, async () => {
    const result = await getWorkoutsApi();
    if (result.error) return result;
    setWorkouts(result.workouts || []);
    return result.workouts || [];
  });

  const createWorkout = withLoadingAndError(setLoading, setError, async (name) => {
    const result = await createWorkoutApi(name);
    if (!result.error) setWorkouts(prev => [...prev, result.workout]);
    return result;
  });

  const updateWorkout = withLoadingAndError(setLoading, setError, async (workoutId, name) => {
    const result = await updateWorkoutApi(workoutId, name);
    if (!result.error) setWorkouts(prev =>
      prev.map(w => w.id === workoutId ? result.workout : w)
    );
    return result;
  });

  const delWorkout = withLoadingAndError(setLoading, setError, async (workoutId) => {
    const result = await deleteWorkoutApi(workoutId);
    if (!result.error) setWorkouts(prev => prev.filter(w => w.id !== workoutId));
    return result;
  });

  // Fetch workouts when user changes
  useEffect(() => {
    if (user) getWorkouts();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else setWorkouts([]);
  }, [user, getWorkouts]);

  return (
    <WorkoutContext.Provider value={{ workouts, loading, error, getWorkouts, createWorkout, updateWorkout, delWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
}