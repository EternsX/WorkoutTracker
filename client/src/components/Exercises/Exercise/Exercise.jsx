import { useState, useRef, useEffect } from "react";
import useExercise from "../../../context/Exercises/useExercise";
import './Exercise.css'
import Sets from '../../Sets/Sets'

export default function Exercise({ exercise, workoutId }) {
  const { updateExercise, delExercise, updateRestTimers } = useExercise();

  const [editedName, setEditedName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [restAfterExercise, setRestAfterExercise] = useState(exercise.rest_after_exercise || 180);

  const menuRef = useRef(null);


  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const startEditing = (exercise) => {
    setEditingId(exercise.id);
    setEditedName(exercise.name);
    setOpenMenuId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedName("");
  };

  const handleUpdate = async (id) => {
    if (!editedName.trim()) return;

    await updateExercise(editedName.trim(), workoutId, id);

    setEditingId(null);
    setEditedName("");
  };

  const handleDelete = async (id) => {
    await delExercise(workoutId, id);
    setOpenMenuId(null);
  };



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (exercise?.rest_after_exercise) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestAfterExercise(exercise.rest_after_exercise || 180);
    }
  }, [exercise?.rest_after_exercise])

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
                if (e.key === "Enter") handleUpdate(exercise.id);
              }}
            />

            <button onClick={() => handleUpdate(exercise.id)}>Save</button>
            <button onClick={cancelEditing}>Cancel</button>
          </div>
        ) : (
          <>
            <div className="exercise-info">
              <div className="exercise-name">{exercise.name}</div>
              <div className="exercise-timer-wrapper">
                <select
                  className="exercise-timer-select"
                  value={restAfterExercise}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setRestAfterExercise(value);

                    updateRestTimers(
                      { rest_after_exercise: value },
                      workoutId,
                      exercise.id
                    );
                  }}
                >
                  {[15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map((sec) => (
                    <option key={sec} value={sec}>
                      ⏱ {sec}s
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="exercise-actions">
              <button
                className="menu-btn"
                onClick={() => toggleMenu(exercise.id)}
              >
                ⋮
              </button>

              {openMenuId === exercise.id && (
                <div className="menu-dropdown" ref={menuRef}>
                  <button onClick={() => startEditing(exercise)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(exercise.id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Sets workoutId={workoutId} exerciseId={exercise.id} />
    </div>
  );
}