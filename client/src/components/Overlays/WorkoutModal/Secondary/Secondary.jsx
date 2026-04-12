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

    // ⏱ Duration timer state
    const [timerRunning, setTimerRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerFinished, setTimerFinished] = useState(false);
    const [paused, setPaused] = useState(false); // new state to track pause

    const curExercise = exercises?.[exIdx];
    const curSets = curExercise ? sets?.[curExercise.workout_exercise_id] : [];
    const curSet = curSets?.[setIdx];

    const totalExercises = exercises?.length || 0;
    const totalSets = curSets?.length || 0;

    // Initialize duration timer if type is time
    useEffect(() => {
        if (curExercise?.type === 'time') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTimeLeft(curSet?.duration || 0);
            setTimerRunning(false);
            setTimerFinished(false);
            setPaused(false);
        }
    }, [curSet, curExercise?.type]);

    // Rest timer effect
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

    // Duration timer effect
    useEffect(() => {
        if (!timerRunning) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setTimerRunning(false);
                    setTimerFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timerRunning]);

    const startRest = (seconds) => {
        setRestTime(seconds);
        setIsResting(true);
    };

    const handleNext = async () => {
        if (!curExercise || !session) return;

        const restBetweenSets = curSet?.rest_between_sets ?? curExercise?.rest_between_sets ?? 60;
        const restAfterExercise = curExercise?.rest_after_exercise ?? 120;

        let nextSetIdx = setIdx + 1;
        let nextExIdx = exIdx;

        if (nextSetIdx >= totalSets) {
            nextSetIdx = 0;
            nextExIdx = exIdx + 1;
        }

        const nextExerciseId = exercises[nextExIdx]?.workout_exercise_id || curExercise?.workout_exercise_id;
        const reps = curExercise?.type === 'reps' ? curSet?.reps || 0 : null;
        const duration = curExercise?.type === 'time' ? curSet?.duration || 0 : null;
        const weight = curExercise?.weight || 0;

        await updateProgress(session.id, nextExerciseId, nextSetIdx, reps, duration, weight);

        if (setIdx + 1 < totalSets) {
            setSetIdx(nextSetIdx);
            startRest(restBetweenSets);
        } else if (exIdx + 1 < totalExercises) {
            setExIdx(nextExIdx);
            setSetIdx(0);
            startRest(restAfterExercise);
        } else {
            handleFinishWorkout("FINISHED", session.id);
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
                    <span className="set-reps">
                        {curExercise?.type === 'reps' ? `${curSet?.reps} reps` : `${timeLeft}s`}
                    </span>
                </div>
            </div>

            {/* Reps vs Duration controls */}
            {curExercise?.type === 'time' && !isResting && (
                <>
                    {!timerRunning && !timerFinished && !paused && (
                        <button
                            className="workout-modal-next-btn"
                            onClick={() => setTimerRunning(true)}
                        >
                            Start Set
                        </button>
                    )}

                    {!timerRunning && paused && (
                        <div className="duration-controls">
                            <button onClick={() => { setTimerRunning(true); setPaused(false); }}>
                                Continue Set
                            </button>
                            <button onClick={() => setTimeLeft(curSet.duration)}>Restart</button>
                        </div>
                    )}

                    {timerRunning && (
                        <div className="duration-controls">
                            <span className="timer-label">Time left: {timeLeft}s</span>
                            <button onClick={() => { setTimerRunning(false); setPaused(true); }}>Pause</button>
                            <button onClick={() => setTimeLeft(curSet.duration)}>Restart</button>
                        </div>
                    )}

                    {timerFinished && (
                        <div className="duration-controls">
                            <button onClick={() => handleNext()}>Next Set</button>
                        </div>
                    )}
                </>
            )}

            {curExercise?.type === 'reps' && !isResting && (
                <button className="workout-modal-next-btn" onClick={() => handleNext()} disabled={isResting}>
                    Complete Set
                </button>
            )}

            {isResting && <div className="rest-timer">Rest: {restTime}s</div>}
        </div>
    );
}