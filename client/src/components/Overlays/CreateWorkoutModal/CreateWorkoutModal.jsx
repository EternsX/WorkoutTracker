import "./CreateWorkoutModal.css";
import { useEffect, useState, useRef } from "react";
import useOverlay from "../../../context/UIOverlay/useOverlay";
import useWorkout from "../../../context/Workouts/useWorkout";
import { MODAL_TYPES } from "../../../constants/modalTypes";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";

export default function CreateWorkoutModal() {
  const { overlays, closeOverlay } = useOverlay();
  const { createWorkout } = useWorkout();
  const [workout, setWorkout] = useState("");
  const workoutRef = useRef(null);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workout.trim()) return;

    // 1️⃣ create workout via context
    const result = await createWorkout(workout.trim());

    if (!result.error) {
      // 2️⃣ close modal
      handleClose();

      // 3️⃣ navigate to the newly created workout
      navigate(`/workouts/${result.workout.id}`);
    }
  };

  if (!overlayData) return null;

  return (
        <Modal type={MODAL_TYPES.CREATE_WORKOUT}> 

        <h2 className="title">Create Your Workout</h2>
        <form
          className="form"
          onSubmit={handleSubmit}
        >
          <div className="input-group">
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
          <button type="submit" className="button">
            Create
          </button>
        </form>
      </Modal>
  );
}