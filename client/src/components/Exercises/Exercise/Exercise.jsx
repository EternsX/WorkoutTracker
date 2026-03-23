// src/components/Exercise/Exercise.jsx
import { useState, useEffect } from "react";
import useExercise from "../../../context/Exercises/useExercise";
import useExerciseItem from "./useExerciseItem";
import ExerciseActions from "./ExerciseActions";
import Sets from "../../Sets/Sets";
import './Exercise.css';

export default function Exercise({ exercise, workoutId }) {
  const { updateExercise, delExercise, updateRestTimers } = useExercise();

  const {
    editingId,
    editedName,
    openMenuId,
    menuRef,
    toggleMenu,
    startEditing,
    cancelEditing,
    handleUpdate,
    handleDelete,
    setEditedName
  } = useExerciseItem(exercise, updateExercise, delExercise);

  const [restAfterExercise, setRestAfterExercise] = useState(exercise.rest_after_exercise || 180);

  // Keep rest timer in sync
  useEffect(() => {
    if (exercise?.rest_after_exercise) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestAfterExercise(exercise.rest_after_exercise);
    }
  }, [exercise?.rest_after_exercise]);

  const handleRestChange = (value) => {
    setRestAfterExercise(value);
    updateRestTimers(
      { rest_after_exercise: value },
      workoutId,
      exercise.workout_exercise_id
    );
  };

  return (
    <div className="exercise-item-wrapper">
      <div className="exercise-item">
        {editingId === exercise.id ? (
          <div className="exercise-editing">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUpdate();
              }}
            />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={cancelEditing}>Cancel</button>
          </div>
        ) : (
          <>
            <div className="exercise-info">
              <div className="exercise-name">{exercise.name}</div>
              <div className="exercise-timer-wrapper">
                <span>⏱</span>
                <select
                  className="exercise-timer-select"
                  value={restAfterExercise}
                  onChange={(e) => handleRestChange(Number(e.target.value))}
                >
                  {[15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((sec) => (
                    <option key={sec} value={sec}>{sec}s</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="exercise-actions">
              <ExerciseActions
                openMenuId={openMenuId}
                exercise={exercise}
                menuRef={menuRef}
                toggleMenu={toggleMenu}
                startEditing={startEditing}
                handleDelete={handleDelete}
              />
            </div>
          </>
        )}
      </div>

      <Sets workoutId={workoutId} workoutExerciseId={exercise.workout_exercise_id} />
    </div>
  );
}