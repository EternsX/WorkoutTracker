import useExercise from '../../../../context/Exercises/useExercise';
import './Main.css'
import { useState } from 'react';

export default function Main({ sets, handleBeginWorkout }) {
    const { getExercise, exercises } = useExercise();
    const [clickedId, setClickedId] = useState(null);
    return (
        <div className="workout-modal-exercises-container">
            {
                Object.keys(sets).map((exerciseId) => {
                    const exercise = getExercise(exerciseId);
                    const numSets = sets[exerciseId]?.length || 0;

                    return (
                        <div className={`workout-modal-exercise ${clickedId === exerciseId ? "active" : ""}`} key={exerciseId} onClick={() => {setClickedId((exerciseId !== clickedId) ? exerciseId : null)}}>
                            <span>{exercise.name}</span>
                            <span>{numSets} set{numSets !== 1 ? 's' : ''}</span>
                        </div>
                    )
                })
            }

            <button className="workout-modal-begin-btn" onClick={handleBeginWorkout}>
                Begin Workout
            </button>
        </div>
    )
}