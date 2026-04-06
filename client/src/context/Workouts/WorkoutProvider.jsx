import { useState, useEffect, useCallback, useMemo } from "react";
import WorkoutContext from "./WorkoutContext";
import { withLoadingAndError } from "../../utils/apiHelpers";
import { requireFields } from "../../utils/validation";
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

  // ✅ GET WORKOUTS
  const getWorkouts = useCallback(() => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await getWorkoutsApi();

      const workoutsArray = result?.workouts || [];
      setWorkouts(workoutsArray);

      return { workouts: workoutsArray };
    })();
  }, []);

  // ✅ CREATE WORKOUT
  const createWorkout = useCallback((name) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const errors = requireFields({ name });
      if (Object.keys(errors).length) throw { errors };

      const result = await createWorkoutApi(name);

      setWorkouts(prev => [...prev, result.workout]);

      return { workout: result.workout };
    })();
  }, []);

  // ✅ UPDATE WORKOUT
  const updateWorkout = useCallback((workoutId, name) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const errors = requireFields({ name });
      if (Object.keys(errors).length) throw { errors };

      const result = await updateWorkoutApi(workoutId, name);

      setWorkouts(prev =>
        prev.map(w => (w.id === workoutId ? result.workout : w))
      );

      return { workout: result.workout };
    })();
  }, []);

  // ✅ DELETE WORKOUT
  const deleteWorkout = useCallback((workoutId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      await deleteWorkoutApi(workoutId);

      setWorkouts(prev => prev.filter(w => w.id !== workoutId));

      return { success: true };
    })();
  }, []);

  // ✅ COMPLETE WORKOUT
  const completeWorkout = useCallback((workoutId, sessionId) => {
    return withLoadingAndError(setLoading, setError, async () => {
      const result = await completeWorkoutApi(workoutId, sessionId);

      return { result };
    })();
  }, []);

  // ✅ GET SINGLE WORKOUT (SYNC)
  const getWorkout = useCallback((workoutId) => {
    return workouts.find(w => w.id === workoutId) || null;
  }, [workouts]);

  // ✅ AUTO LOAD ON LOGIN
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
    deleteWorkout,
    completeWorkout,
    getWorkout,
  }), [
    workouts,
    loading,
    error,
    getWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    completeWorkout,
    getWorkout
  ]);

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}