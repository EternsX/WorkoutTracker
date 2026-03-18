import './WorkoutModal.css'
import useOverlay from '../../../context/UIOverlay/useOverlay'
import { MODAL_TYPES } from '../../../constants/modalTypes';
import useWorkout from '../../../context/Workouts/useWorkout';
import Main from './Main/Main';
import Secondary from './Secondary/Secondary';
import { useState } from 'react';
import useSet from '../../../context/Sets/useSet'

export default function ExerciseModal() {
    const [workoutInProgress, setWorkoutInProgress] = useState(false); 
    const { sets } = useSet();
    const { overlays, closeOverlay } = useOverlay();
    const { getWorkout } = useWorkout();
    

    const overlayData = overlays.find((o) => o.type === MODAL_TYPES.EXERCISE);
    const workoutId = overlayData?.payload?.workoutId;

    const handleBeginWorkout = () => {
        setWorkoutInProgress(true)
    }

    const handleClose = () => {
        setWorkoutInProgress(false)

        closeOverlay(MODAL_TYPES.EXERCISE)
    };

    const handleFinishWorkout = () => {
        setWorkoutInProgress(false)
    };

    if (!overlayData) return null;

    return (
        <div className="workout-modal-backdrop" onClick={!workoutInProgress ? handleClose : null}>
            <div className="workout-modal-panel" onClick={(e) => e.stopPropagation()}>

                <button
                    className="workout-modal-close-btn"
                    onClick={handleClose}
                >
                    ×
                </button>

                <h2>{getWorkout(workoutId)?.name}</h2>

                {workoutInProgress ?
                    <Secondary sets={sets} handleFinishWorkout={handleFinishWorkout} />
                    :
                    <Main sets={sets} handleBeginWorkout={handleBeginWorkout} />
                }

            </div>
        </div>
    )
}