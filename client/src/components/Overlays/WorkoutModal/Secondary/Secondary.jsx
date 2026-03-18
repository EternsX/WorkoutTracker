import './Secondary.css'
import useExercise from '../../../../context/Exercises/useExercise'
import { useState, useEffect } from 'react';

export default function Secondary({ sets, handleFinishWorkout }) {
    const { exercises } = useExercise();

    const [exIdx, setExIdx] = useState(0);
    const [setIdx, setSetIdx] = useState(0);

    const [restTime, setRestTime] = useState(0);
    const [isResting, setIsResting] = useState(false);

    const curExercise = exercises?.[exIdx];
    const curSets = curExercise ? sets?.[curExercise.id] : [];
    const curSet = curSets?.[setIdx];

    const totalExercises = exercises?.length || 0;
    const totalSets = curSets?.length || 0;

    // ⏱ Timer effect
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

    const handleNext = () => {
        if (!curExercise) return;

        const restBetweenSets = curSet?.rest_between_sets ?? curExercise?.rest_between_sets ?? 60;
        const restAfterExercise = curExercise?.rest_after_exercise ?? 120;

        if (setIdx + 1 < totalSets) {
            startRest(restBetweenSets);

            setTimeout(() => {
                setSetIdx(i => i + 1);
            }, restBetweenSets * 1000);

        } else {
            if (exIdx + 1 < totalExercises) {
                startRest(restAfterExercise);

                setTimeout(() => {
                    setExIdx(i => i + 1);
                    setSetIdx(0);
                }, restAfterExercise * 1000);

            } else {
                handleFinishWorkout();
            }
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
                    <span className="set-number">
                        Set {setIdx + 1} / {totalSets}
                    </span>

                    <span className="set-reps">
                        {curSet?.reps} reps
                    </span>
                </div>
            </div>

            {/* ⏱ Timer UI */}
            {isResting && (
                <div className="rest-timer">
                    Rest: {restTime}s
                </div>
            )}

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