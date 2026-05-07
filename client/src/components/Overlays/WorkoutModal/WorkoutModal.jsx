import './WorkoutModal.css'
import useOverlay from '../../../context/UIOverlay/useOverlay'
import { MODAL_TYPES } from '../../../constants/modalTypes';
import useWorkout from '../../../context/Workouts/useWorkout';
import Preview from './Preview/Preview';
import Secondary from './Secondary/Secondary';
import { useState } from 'react';
import useSet from '../../../context/Sets/useSet'
import useSession from '../../../context/Session/useSession';
import useExercise from '../../../context/Exercises/useExercise';

export default function WorkoutModal() {
    const [workoutInProgress, setWorkoutInProgress] = useState(false);

    const { sets } = useSet();
    const { session, startSession, endSession } = useSession();
    const { overlays, closeOverlay } = useOverlay();
    const { getWorkout, completeWorkout } = useWorkout();
    const { exercises } = useExercise();

    const overlayData = overlays.find(
        (o) => o.type === MODAL_TYPES.START_WORKOUT
    );

    const workoutId = overlayData?.payload?.workoutId;

    const workoutSets = workoutId ? sets[workoutId] || {} : {};


    const id = session?.progress?.workout_exercise_id || null;
    const ex_idx = exercises?.findIndex(e => e.workout_exercise_id === id);
    const safe_idx = ex_idx === -1 ? 0 : ex_idx;
    const set_idx = session?.progress?.setNumber || 0;

    const handleBeginWorkout = () => {
        setWorkoutInProgress(true);
        if (session?.workout_id !== workoutId) {
            startSession(workoutId);
        }
    };

    const handleClose = () => {
        setWorkoutInProgress(false);
        closeOverlay(MODAL_TYPES.START_WORKOUT);
    };


    const handleFinishWorkout = async (status = "DISCARDED", sessionId) => {
        if (status === "FINISHED") {
            await completeWorkout(workoutId, sessionId);
        }
        setWorkoutInProgress(false);
        await endSession(status, sessionId);
    };

    if (!overlayData) return null;

    return (
        <div
            className="workout-modal-backdrop"
            onClick={!workoutInProgress ? handleClose : null}
        >
            <div
                className="workout-modal-panel"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="workout-modal-close-btn"
                    onClick={handleClose}
                >
                    ×
                </button>

                <h2>{getWorkout(workoutId)?.name}</h2>

                {workoutInProgress ? (
                    <Secondary
                        ex_idx={safe_idx}
                        set_idx={set_idx}
                        sets={workoutSets}
                        handleFinishWorkout={handleFinishWorkout}
                    />
                ) : (
                    <Preview
                        session={session}
                        sets={workoutSets}
                        handleBeginWorkout={handleBeginWorkout}
                        handleFinishWorkout={handleFinishWorkout}
                    />
                )}
            </div>
        </div>
    );
}