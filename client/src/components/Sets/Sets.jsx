import { useState, useEffect } from "react";
import useSet from "../../context/Sets/useSet";
import "./Sets.css";
import Set from "./Set/Set";
import useExercise from "../../context/Exercises/useExercise";

export default function Sets({ workoutId, workoutExerciseId }) {
  const { getExercise, updateRestTimers } = useExercise();
  const { sets, getSets, createSet } = useSet();

  // ✅ This is now clearly a workout_exercise
  const workoutExercise = getExercise(workoutExerciseId);

  const [newWeight, setNewWeight] = useState("");
  const [newReps, setNewReps] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [restBetweenSets, setRestBetweenSets] = useState(60);

  // ✅ Get sets for this workout_exercise
  const curSets = sets[workoutId]?.[workoutExerciseId];
  const curSetsSafe = curSets || [];

  // ✅ Fetch sets only if not loaded yet
  useEffect(() => {
    if (workoutId && workoutExerciseId && !curSets) {
      getSets(workoutId, workoutExerciseId);
    }
  }, [workoutId, workoutExerciseId, getSets, curSets]);

  // ✅ Sync rest timer correctly (fix: != null)
  useEffect(() => {
    if (workoutExercise?.rest_between_sets != null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestBetweenSets(workoutExercise.rest_between_sets);
    }
  }, [workoutExercise?.rest_between_sets]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddSet();
    }
  };

  const handleAddSet = async () => {
    if (!newReps) return;

    await createSet(
      Number(newReps),
      Number(newWeight),
      workoutId,
      workoutExerciseId
    );

    setNewReps("");
    setNewWeight("");
  };

  return (
    <div className="sets-container">
      <div
        className="sets-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="sets-info">
          <span className="sets-count">{curSetsSafe.length} sets</span>

          <span className="sets-reps">
            {curSetsSafe.length > 0 &&
              ` • ${curSetsSafe.map((s) => s.reps).join("-")} reps`}
          </span>
        </div>

        {/* ✅ REST TIMER */}
        <div
          className="set-timer-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          <span>⏱</span>

          <select
            className="set-timer-select"
            value={restBetweenSets}
            onChange={(e) => {
              const value = Number(e.target.value);

              setRestBetweenSets(value);

              updateRestTimers(
                { rest_between_sets: value },
                workoutId,
                workoutExerciseId
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
        {curSetsSafe.map((s, index) => (
          <Set
            key={s.id}
            set={s}
            i={index}
            workoutId={workoutId}
            workoutExerciseId={workoutExerciseId} // ✅ FIX
          />
        ))}

        <div className="set-add-row">
          <input
            placeholder="Reps"
            value={newReps}
            onChange={(e) => setNewReps(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            placeholder="Weight"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleAddSet}>Add</button>
        </div>
      </div>
    </div>
  );
}