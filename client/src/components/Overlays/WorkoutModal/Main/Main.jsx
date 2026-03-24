import useExercise from '../../../../context/Exercises/useExercise';
import useSession from '../../../../context/Session/useSession';
import { useState } from 'react'; // ✅ add
import './Main.css';

export default function Main({ session, sets, handleBeginWorkout }) {
    const { getExercise } = useExercise();
    const { endSession } = useSession();

    const [isDeleting, setIsDeleting] = useState(false); // ✅ add

    const exerciseIds = Object.keys(sets);

    const handleDiscard = async () => {
        if (!session || isDeleting) return;

        setIsDeleting(true);

        try {
            const result = await endSession("discarded", session.id);

            if (result?.error) return;

            // optional: refresh / close modal / redirect if needed
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
                        <span>
                            {numSets} set{numSets !== 1 ? 's' : ''}
                        </span>
                    </div>
                );
            })}

            {/* ✅ Primary button */}
            <button
                className="workout-modal-begin-btn"
                onClick={handleBeginWorkout}
                disabled={isDeleting} // optional safety
            >
                {session ? "Resume Workout" : "Begin Workout"}
            </button>

            {/* ✅ Discard button with loading */}
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
    );
}