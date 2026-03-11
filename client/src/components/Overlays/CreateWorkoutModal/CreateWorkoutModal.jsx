import "./CreateWorkoutModal.css";
import { useEffect, useState, useRef } from "react";
import useOverlay from "../../../context/UIOverlay/useOverlay";
import useWorkout from "../../../context/Workouts/useWorkout";
import { MODAL_TYPES } from "../../../constants/modalTypes";

export default function CreateWorkoutModal() {
  const { overlays, closeOverlay } = useOverlay();
  const { createWorkout } = useWorkout();
  const [workout, setWorkout] = useState("");
  const workoutRef = useRef(null);

  // Find this modal in the overlay stack
  const overlayData = overlays.find(
    (o) => o.type === MODAL_TYPES.CREATE_WORKOUT
  );

  const handleClose = () => closeOverlay(MODAL_TYPES.CREATE_WORKOUT);

  useEffect(() => {
    if (overlayData) {
      workoutRef.current?.focus();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWorkout("");
    }
  }, [overlayData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!workout.trim()) return;

    createWorkout(workout.trim());
    handleClose();
  };

  if (!overlayData) return null; // modal not open

  return (
    <div
      className={`create_workout-overlay-backdrop ${
        overlayData ? "show" : ""
      }`}
      onClick={handleClose}
    >
      <div
        className={`create_workout-overlay-panel ${
          overlayData ? "open" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="create_workout-title">Create Your Workout</h2>
        <form
          className="create_workout-form"
          onSubmit={handleSubmit}
        >
          <div className="create_workout-input-block">
            <input
              ref={workoutRef}
              onChange={(e) => setWorkout(e.target.value)}
              value={workout}
              id="workout"
              type="text"
              placeholder=" "
            />
            <label htmlFor="workout">Workout</label>
          </div>
          <button type="submit" className="create_workout-button">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}