import useExercise from '../../../../context/Exercises/useExercise';
import './Main.css'

export default function Main({ session, sets, handleBeginWorkout }) {
    const { getExercise } = useExercise();

    const exerciseIds = Object.keys(sets);

    return (
        <div className="workout-modal-exercises-container">
            {exerciseIds.length === 0 && (
                <p className="empty-message">No exercises with sets yet</p>
            )}

            {exerciseIds.map((exerciseId) => {
                const exercise = getExercise(exerciseId);
                const numSets = sets[exerciseId]?.length || 0;

                // ✅ guard against undefined exercise
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

            <button
                className="workout-modal-begin-btn"
                onClick={handleBeginWorkout}
            >
                {session ? "Resume Workout" : "Begin Workout"}
            </button>
        </div>
    );
}