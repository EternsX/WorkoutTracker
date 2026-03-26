import { useState, useEffect, useCallback, useMemo } from "react";
import WorkoutContext from "./WorkoutContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import {
  getWorkoutsApi,
  createWorkoutApi,
  updateWorkoutApi,
  deleteWorkoutApi,
  completeWorkoutApi,
} from "./workoutsApi";
import useAuth from "../Auth/useAuth";

export default function WorkoutProvider({ children }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const getWorkouts = useCallback(async () => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await getWorkoutsApi();

      if (!result.error) {
        setWorkouts(result.workouts || []);
      }

      return result;
    })();
  }, []);

  const createWorkout = useCallback(async (name) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await createWorkoutApi(name);

      if (!result.error) {
        setWorkouts(prev => [...prev, result.workout]);
      }

      return result;
    })();
  }, []);

  const updateWorkout = useCallback(async (workoutId, name) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await updateWorkoutApi(workoutId, name);

      if (!result.error) {
        setWorkouts(prev =>
          prev.map(w => (w.id === workoutId ? result.workout : w))
        );
      }

      return result;
    })();
  }, []);

  const delWorkout = useCallback(async (workoutId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await deleteWorkoutApi(workoutId);

      if (!result.error) {
        setWorkouts(prev => prev.filter(w => w.id !== workoutId));
      }

      return result;
    })();
  }, []);

  const completeWorkout = useCallback(async (workoutId, sessionId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await completeWorkoutApi(workoutId, sessionId);

      return result;
    })();
  }, []);

  const getWorkout = useCallback((workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    return workout
  }, [workouts])

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWorkouts([]);
      return;
    }

    getWorkouts();
  }, [user, getWorkouts]);

  const value = useMemo(() => ({
    workouts,
    loading,
    error,
    getWorkouts,
    createWorkout,
    updateWorkout,
    delWorkout,
    getWorkout,
    completeWorkout,
  }), [workouts, loading, error, getWorkouts, createWorkout, updateWorkout, completeWorkout, delWorkout, getWorkout]);

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}