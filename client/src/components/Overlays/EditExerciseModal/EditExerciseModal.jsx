import "./EditExerciseModal.css";
import { useEffect, useState, useRef } from "react";
import useOverlay from "../../../context/UIOverlay/useOverlay";
import useExercise from "../../../context/Exercises/useExercise";
import { MODAL_TYPES } from "../../../constants/modalTypes";

export default function EditExerciseModal() {

  const { overlays, closeOverlay } = useOverlay();
  const { updateExercise } = useExercise();

  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const nameRef = useRef(null);

  const overlayData = overlays.find(
    (o) => o.type === MODAL_TYPES.EDIT_EXERCISE
  );

  const handleClose = () => closeOverlay(MODAL_TYPES.EDIT_EXERCISE);

  useEffect(() => {
    if (overlayData) {

      const { exercise } = overlayData.payload;

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(exercise.name);
      setSets(exercise.sets);
      setReps(exercise.reps);
      setWeight(exercise.weight);

      nameRef.current?.focus();
    }
  }, [overlayData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    const { exercise } = overlayData.payload;

    await updateExercise(
      exercise.id,
      name.trim(),
      Number(sets),
      Number(reps),
      exercise.workout_id
    );

    handleClose();
  };

  if (!overlayData) return null;

  return (
    <div
      className={`edit_exercise-overlay-backdrop ${
        overlayData ? "show" : ""
      }`}
      onClick={handleClose}
    >
      <div
        className={`edit_exercise-overlay-panel ${
          overlayData ? "open" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >

        <h2 className="edit_exercise-title">
          Edit Exercise
        </h2>

        <form
          className="edit_exercise-form"
          onSubmit={handleSubmit}
        >

          <div className="edit_exercise-input-block">
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder=" "
              id="exercise_name"
            />
            <label htmlFor="exercise_name">
              Exercise Name
            </label>
          </div>

          <div className="edit_exercise-input-block">
            <input
              value={sets}
              onChange={(e) => setSets(e.target.valueAsNumber)}
              type="number"
              placeholder=" "
              id="exercise_sets"
            />
            <label htmlFor="exercise_sets">
              Sets
            </label>
          </div>

          <div className="edit_exercise-input-block">
            <input
              value={reps}
              onChange={(e) => setReps(e.target.valueAsNumber)}
              type="number"
              placeholder=" "
              id="exercise_reps"
            />
            <label htmlFor="exercise_reps">
              Reps
            </label>
          </div>

          <div className="edit_exercise-input-block">
            <input
              value={weight}
              onChange={(e) => setWeight(e.target.valueAsNumber)}
              type="number"
              placeholder=" "
              id="exercise_reps"
            />
            <label htmlFor="exercise_reps">
              weight
            </label>
          </div>

          <button
            type="submit"
            className="edit_exercise-button"
          >
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
}