import { useState, useRef, useEffect } from "react";
import useExercise from "../../../context/Exercises/useExercise";
import useOverlay from "../../../context/UIOverlay/useOverlay";
import { MODAL_TYPES } from "../../../constants/modalTypes";
import "./CreateExerciseModal.css";
import Modal from "../Modal/Modal";

export default function CreateExerciseModal() {
  const { overlays, closeOverlay } = useOverlay();
  const { createExercise, loading, error } = useExercise();

  const [name, setName] = useState("");
  const nameRef = useRef(null);

  // Find this modal in the overlay stack
  const overlayData = overlays.find(
    (o) => o.type === MODAL_TYPES.CREATE_EXERCISE
  );

  const workoutId = overlayData?.payload?.workoutId;

  // Close only this modal
  const handleClose = () => closeOverlay(MODAL_TYPES.CREATE_EXERCISE);

  useEffect(() => {
    if (overlayData) {
      nameRef.current?.focus();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName("");
    }
  }, [overlayData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    const res = await createExercise(name.trim(), workoutId);

    if (res?.error) return; // ❌ stay open if error

    handleClose(); // ✅ close only on success
  };

  if (!overlayData) return null;

  return (
    <Modal type={MODAL_TYPES.CREATE_EXERCISE}>
      <h2 className="title">Create Your Exercise</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            ref={nameRef}
            onChange={(e) => setName(e.target.value)}
            value={name}
            id="name"
            type="text"
            placeholder=" "
          />
          <label htmlFor="name">Exercise Name</label>
        </div>

        {error && <div className="error">{error}</div>}

        <button className="button" disabled={loading} type="submit">
          {loading ? <span className="spinner"></span> : "Create"}
        </button>
      </form>
    </Modal>
  );
}