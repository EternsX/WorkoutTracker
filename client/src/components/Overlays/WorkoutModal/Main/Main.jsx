import useExercise from '../../../../context/Exercises/useExercise';
import { useState } from 'react'; // ✅ add
import './Main.css';

export default function Main({ session, sets, handleBeginWorkout, handleFinishWorkout }) {
    const { getExercise } = useExercise();
    const [isDeleting, setIsDeleting] = useState(false);

    const exerciseIds = Object.keys(sets);

    const handleDiscard = async () => {
        if (!session || isDeleting) return;

        setIsDeleting(true);

        try {
            await handleFinishWorkout("DISCARDED", session.id);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="workout-modal-exercises-container">
            {exerciseIds.length === 0 && (
                <p className="empty-message">No exercises with sets yet</p>
            )}

            {exerciseIds.map((exerciseId) => {
                const exercise = getExercise(exerciseId);
                const numSets = sets[exerciseId]?.length || 0;

                if (!exercise) return null;

                return (
                    <div className="workout-modal-exercise" key={exerciseId}>
                        <span>{exercise.name}</span>
                        <span>{numSets} set{numSets !== 1 ? 's' : ''}</span>
                    </div>
                );
            })}

            <div className="workout-modal-buttons">
                <button
                    className="workout-modal-begin-btn"
                    onClick={handleBeginWorkout}
                    disabled={isDeleting}
                >
                    {session ? "Resume Workout" : "Begin Workout"}
                </button>

                {session && (
                    <button
                        className="workout-modal-discard-btn"
                        onClick={handleDiscard}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Discard Workout"}
                    </button>
                )}
            </div>
        </div>
    );
}