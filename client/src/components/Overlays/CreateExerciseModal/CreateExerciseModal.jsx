import { useState, useRef, useEffect } from "react";
import useExercise from "../../../context/Exercises/useExercise";
import useOverlay from "../../../context/UIOverlay/useOverlay";
import { MODAL_TYPES } from "../../../constants/modalTypes";
import "./CreateExerciseModal.css";

export default function CreateExerciseModal() {
  const { overlays, closeOverlay } = useOverlay();
  const { createExercise } = useExercise();
  const [name, setName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const nameRef = useRef(null);
  // Find this modal in the overlay stack
  const overlayData = overlays.find((o) => o.type === MODAL_TYPES.CREATE_EXERCISE);
  const workoutId = overlayData?.payload?.workoutId;

  // Close only this modal
  const handleClose = () => closeOverlay(MODAL_TYPES.CREATE_EXERCISE);

  useEffect(() => {
    if (overlayData) {
      nameRef.current?.focus();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName("");
      setSets("");
      setReps("");
      setWeight("");
    }
  }, [overlayData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createExercise(name.trim(), sets, reps, weight, workoutId);
    handleClose();
  };
  if (!overlayData) return null; // modal not open

  return (
    <div className="exercise-modal-backdrop" onClick={handleClose}>
      <div className="exercise-modal-panel" onClick={(e) => e.stopPropagation()}>
        <h2>Create Exercise</h2>
        <form onSubmit={handleSubmit} className="exercise-form">
          <input
            ref={nameRef}
            type="text"
            placeholder="Exercise Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={(e) => setSets(e.target.valueAsNumber)}
          />
          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.valueAsNumber)}
          />
          <input
            type="number"
            placeholder="weight (optional)"
            value={weight}
            onChange={(e) => setWeight(e.target.valueAsNumber)}
          />
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}