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


  const handleDelete = async (id) => {
    await delExercise(workoutId, id);
  };

  const handleAddExercise = () => {
    openOverlay({
      type: MODAL_TYPES.CREATE_EXERCISE,
      payload: { workoutId }
    });
  };



  return (
    <div className="workout-details">

      <h2 className="workout-title">Exercises</h2>

      <div className="exercises-list">

        {exercises.length === 0 && (
          <p className="empty-message">
            No exercises yet
          </p>
        )}

        {exercises.map((ex) => (

          <div key={ex.id} className="exercise-item">

            <div className="exercise-info">
              <div className="exercise-name">
                {ex.name}
              </div>

            </div>

            <div className="exercise-actions">

              <button>
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