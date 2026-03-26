import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useExercise from "../../context/Exercises/useExercise";
import useOverlay from "../../context/UIOverlay/useOverlay";
import { MODAL_TYPES } from "../../constants/modalTypes";
import "./Exercises.css";
import Exercise from "./Exercise/Exercise";
import useWorkout from "../../context/Workouts/useWorkout"
import useSession from "../../context/Session/useSession";

export default function Exercises() {
  const { workoutId } = useParams();
  const { getWorkout } = useWorkout();
  const { session, getSession } = useSession();
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);

  const { exercises, getExercises } = useExercise();
  const { openOverlay } = useOverlay();

  useEffect(() => {
    getExercises(workoutId)
    if (!session) {
      getSession();
    }
  }, [getExercises, workoutId, getSession, session]);

  const handleAddExercise = () => {
    openOverlay({ type: MODAL_TYPES.CREATE_EXERCISE, payload: { workoutId } });
  };

  const handleStartWorkout = () => {
    if (session && session.workout_id !== workoutId) {
      openOverlay({
        type: MODAL_TYPES.CONFLICT_WORKOUT,
        payload: {
          currentSession: session,
          newWorkoutId: workoutId,
        },
      });
      return;
    }

    openOverlay({
      type: MODAL_TYPES.START_WORKOUT,
      payload: { workoutId },
    });
  };

  const toggleExercise = (id) => {
    setExpandedExerciseId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="workout-details">
      <h2 className="workout-title">{getWorkout(workoutId)?.name || ""}</h2>

      <div className="exercises-list">
        {exercises.length === 0 && (
          <p className="empty-message">No exercises yet</p>
        )}

        {exercises.map((ex) => (
          <Exercise
            key={ex.id}
            exercise={ex}
            workoutId={workoutId}
            expandedExerciseId={expandedExerciseId}
            toggleExercise={toggleExercise}
          />
        ))}
      </div>
      <div className="floating-buttons">
        <button className="floating-add-btn" onClick={handleAddExercise}>
          + Add Exercise
        </button>
        <button className="floating-start-exercise-btn" onClick={handleStartWorkout}>
          {session?.workout_id === workoutId ? 'Continue' : 'Start new'} Workout        </button>
      </div>
    </div>
  );
}