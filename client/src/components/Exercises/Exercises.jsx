import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useExercise from "../../context/Exercises/useExercise";
import useOverlay from "../../context/UIOverlay/useOverlay";
import { MODAL_TYPES } from "../../constants/modalTypes";
import "./Exercises.css";
import Exercise from "./Exercise/Exercise";
import useWorkout from "../../context/Workouts/useWorkout"

export default function Exercises() {
  const { workoutId } = useParams();
  const { getWorkout } = useWorkout();
  const [expandedExerciseId, setExpandedExerciseId] = useState(null);

  const { exercises, getExercises } = useExercise();
  const { openOverlay } = useOverlay();

  useEffect(() => {
    getExercises(workoutId)
  }, [getExercises, workoutId]);

  const handleAddExercise = () => {
    openOverlay({ type: MODAL_TYPES.CREATE_EXERCISE, payload: { workoutId } });
  };

  const handleStartExercise = () => {
    openOverlay({ type: MODAL_TYPES.EXERCISE, payload: { workoutId } })
  }

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
        <button className="floating-start-exercise-btn" onClick={handleStartExercise}>
          Start Workout
        </button>
        <button className="floating-add-btn" onClick={handleAddExercise}>
          + Add Exercise
        </button>
      </div>
    </div>
  );
}