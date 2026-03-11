import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useExercise from "../../context/Exercises/useExercise";
import useOverlay from "../../context/UIOverlay/useOverlay";
import { MODAL_TYPES } from "../../constants/modalTypes";
import "./WorkoutDetails.css";

export default function WorkoutDetails() {

  const { workoutId } = useParams();

  const {
    exercises,
    getExercises,
    delExercise
  } = useExercise();

  const { openOverlay } = useOverlay();

  useEffect(() => {
    getExercises(workoutId);
  }, [getExercises, workoutId]); // remove 'exercises' from deps

  const workoutExercises = exercises.filter(
    (e) => e.workout_id === workoutId
  );

  const handleDelete = async (id) => {
    await delExercise(id, workoutId);
  };

  const handleAddExercise = () => {
    openOverlay({
      type: MODAL_TYPES.CREATE_EXERCISE,
      payload: { workoutId }
    });
  };

  const handleEditExercise = (exercise) => {
    openOverlay({
      type: MODAL_TYPES.EDIT_EXERCISE,
      payload: { exercise }
    });
  };

  return (
    <div className="workout-details">

      <h2 className="workout-title">Exercises</h2>

      <div className="exercises-list">

        {workoutExercises.length === 0 && (
          <p className="empty-message">
            No exercises yet
          </p>
        )}

        {workoutExercises.map((ex) => (

          <div key={ex.id} className="exercise-item">

            <div className="exercise-info">
              <div className="exercise-name">
                {ex.name}
              </div>

              <div className="exercise-stats">
                {ex.sets} sets × {ex.reps} reps {(Number(ex.weight) > 0) && `× ${ex.weight} kg`}
              </div>
            </div>

            <div className="exercise-actions">

              <button
                onClick={() => handleEditExercise(ex)}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(ex.id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      <button
        className="floating-add-btn"
        onClick={handleAddExercise}
      >
        + Add Exercise
      </button>

    </div>
  );
}