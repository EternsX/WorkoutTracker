import './Secondary.css';
import { useState, useEffect } from 'react';
import useExercise from '../../../../context/Exercises/useExercise';
import useSession from '../../../../context/Session/useSession';

export default function Secondary({ ex_idx = 0, set_idx = 0, sets, handleFinishWorkout }) {
    const { exercises } = useExercise();
    const { session, updateProgress } = useSession();

    const [exIdx, setExIdx] = useState(ex_idx);
    const [setIdx, setSetIdx] = useState(set_idx);
    const [restTime, setRestTime] = useState(0);
    const [isResting, setIsResting] = useState(false);

    const curExercise = exercises?.[exIdx];
    const curSets = curExercise ? sets?.[curExercise.workout_exercise_id] : [];
    const curSet = curSets?.[setIdx];

    const totalExercises = exercises?.length || 0;
    const totalSets = curSets?.length || 0;

    // ⏱ Rest timer effect
    useEffect(() => {
        if (!isResting) return;

        const interval = setInterval(() => {
            setRestTime(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setIsResting(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isResting]);

    const startRest = (seconds) => {
        setRestTime(seconds);
        setIsResting(true);
    };

    const handleNext = async () => {
        if (!curExercise || !session) return;

        const restBetweenSets = curSet?.rest_between_sets ?? curExercise?.rest_between_sets ?? 60;
        const restAfterExercise = curExercise?.rest_after_exercise ?? 120;

        // 🔹 Determine next set/exercise
        let nextSetIdx = setIdx + 1;
        let nextExIdx = exIdx;

        if (nextSetIdx >= totalSets) {
            nextSetIdx = 0;
            nextExIdx = exIdx + 1;
        }

        // 🔹 Determine correct workout_exercise_id for progress update
        const nextExerciseId = exercises[nextExIdx]?.workout_exercise_id || curExercise?.workout_exercise_id;

        console.log({
            exIdx, setIdx,
            nextExIdx, nextSetIdx,
            nextExerciseId,
            curSet
        });

        // 🔹 Update session progress
        await updateProgress(
            session.id,
            nextExerciseId,
            nextSetIdx,  // 0-based, increment if your backend uses 1-based
            curSet?.reps,
            curSet?.weight || 0
        );

        // 🔹 Move to next set/exercise or finish
        if (setIdx + 1 < totalSets) {
            startRest(restBetweenSets);
            setTimeout(() => setSetIdx(i => i + 1), restBetweenSets * 1000);
        } else if (exIdx + 1 < totalExercises) {
            startRest(restAfterExercise);
            setTimeout(() => {
                setExIdx(i => i + 1);
                setSetIdx(0);
            }, restAfterExercise * 1000);
        } else {
            handleFinishWorkout();
        }
    };

    return (
        <div className="workout-active-container">
            <div className="workout-progress">
                Exercise {exIdx + 1} / {totalExercises}
            </div>

            <div className="workout-current">
                <h3 className="exercise-name">{curExercise?.name}</h3>
                <div className="set-info">
                    <span className="set-number">Set {setIdx + 1} / {totalSets}</span>
                    <span className="set-reps">{curSet?.reps} reps</span>
                </div>
            </div>

            {isResting && <div className="rest-timer">Rest: {restTime}s</div>}

            <button
                className="workout-modal-next-btn"
                onClick={handleNext}
                disabled={isResting}
            >
                {isResting ? "Resting..." : "Complete Set"}
            </button>
        </div>
    );
}