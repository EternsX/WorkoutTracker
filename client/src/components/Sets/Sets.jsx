import { useState, useEffect } from "react";
import useSet from "../../context/Sets/useSet";
import "./Sets.css";
import Set from "./Set/Set";
import useExercise from "../../context/Exercises/useExercise";

export default function Sets({ workoutId, exerciseId }) {
  const { getExercise, updateRestTimers } = useExercise();
  const { sets, getSets, createSet } = useSet();

  const exercise = getExercise(exerciseId);

  const [newWeight, setNewWeight] = useState("");
  const [newReps, setNewReps] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [restBetweenSets, setRestBetweenSets] = useState(60);

  // ✅ fetch sets
  useEffect(() => {
    getSets(workoutId, exerciseId);
  }, [workoutId, exerciseId, getSets]);

  // ✅ sync rest timer with backend data
  useEffect(() => {
    if (exercise?.rest_between_sets) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestBetweenSets(exercise.rest_between_sets);
    }
  }, [exercise?.rest_between_sets]);

  const handleAddSet = async () => {
    if (!newReps) return;

    await createSet(
      Number(newReps),
      Number(newWeight),
      workoutId,
      exerciseId
    );

    setNewReps("");
    setNewWeight("");
  };

  const curSets = sets[exerciseId] || [];

  return (
    <div className="sets-container">
      <div
        className="sets-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="sets-info">
          <span className="sets-count">{curSets.length} sets</span>
          <span className="sets-reps">
            {curSets.length > 0 &&
              ` • ${curSets.map((s) => s.reps).join("-")} reps`}
          </span>
        </div>

        {/* ✅ REST TIMER DROPDOWN */}
        <div
          className="exercise-timer-wrapper"
          onClick={(e) => e.stopPropagation()}   // 🔥 prevents toggle
        >
          <select
            className="exercise-timer-select"
            value={restBetweenSets}
            onChange={(e) => {
              const value = Number(e.target.value);

              setRestBetweenSets(value);

              updateRestTimers(
                { rest_between_sets: value }, // ✅ correct field
                workoutId,
                exerciseId                  // ✅ safe
              );
            }}
          >
            {[15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180].map(
              (sec) => (
                <option key={sec} value={sec}>
                  {sec} sec
                </option>
              )
            )}
          </select>
        </div>

        <div className={`sets-toggle ${isOpen ? "active" : ""}`}>˅</div>
      </div>

      <div className={`sets-expanded ${isOpen ? "open" : ""}`}>
        {curSets.map((s, index) => (
          <Set
            key={s.id}
            set={s}
            i={index}
            workoutId={workoutId}
            exerciseId={exerciseId}
          />
        ))}

        <div className="set-add-row">
          <input
            placeholder="Reps"
            value={newReps}
            onChange={(e) => setNewReps(e.target.value)}
          />
          <input
            placeholder="Weight"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
          />
          <button onClick={handleAddSet}>Add</button>
        </div>
      </div>
    </div>
  );
}