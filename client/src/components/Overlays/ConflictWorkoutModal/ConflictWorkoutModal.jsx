import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "../Modal/Modal";
import { MODAL_TYPES } from "../../../constants/modalTypes";
import useSession from "../../../context/Session/useSession";
import useOverlay from "../../../context/UIOverlay/useOverlay";
import './ConflictWorkoutModal.css';

export default function ConflictWorkoutModal() {
    const { overlays, closeOverlay, openOverlay } = useOverlay();
    const { endSession } = useSession();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const overlayData = overlays.find(
        (o) => o.type === MODAL_TYPES.CONFLICT_WORKOUT
    );

    // 🛑 If modal not active, don't render anything
    if (!overlayData) return null;

    const { currentSession, newWorkoutId } = overlayData.payload;

    const handleContinue = () => {
        navigate(`/workouts/${currentSession.workout_id}`);
        closeOverlay(MODAL_TYPES.CONFLICT_WORKOUT);
    };

    const handleDiscardAndStart = async () => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            const result = await endSession("discarded", currentSession.id);

            // ❌ Stop if API failed
            if (result?.error) return;

            closeOverlay(MODAL_TYPES.CONFLICT_WORKOUT);

            // ✅ Open start workout modal AFTER closing conflict
            openOverlay({
                type: MODAL_TYPES.START_WORKOUT,
                payload: { workoutId: newWorkoutId },
            });

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal type={MODAL_TYPES.CONFLICT_WORKOUT}>
            <div className="conflict-modal">
                <h2 className="conflict-title">⚠️ Ongoing Workout</h2>

                <p className="conflict-text">
                    You already have a workout in progress.
                </p>
                <p className="conflict-text">
                    Do you want to continue it or start a new one?
                </p>

                <div className="conflict-actions">
                    <button
                        className="button conflict-primary"
                        onClick={handleContinue}
                        disabled={isLoading}
                    >
                        Continue Workout
                    </button>

                    <button
                        className="conflict-danger"
                        onClick={handleDiscardAndStart}
                        disabled={isLoading}
                    >
                        {isLoading ? "Ending..." : "Discard & Start New"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}