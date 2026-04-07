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
  const type = workoutExercise?.type || "reps"; // default to "reps" if not set

  const [newWeight, setNewWeight] = useState("");
  const [newReps, setNewReps] = useState("");
  const [duration, setDuration] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [restBetweenSets, setRestBetweenSets] = useState(60);

  // ✅ Get sets for this workout_exercise
  const curSets = sets[workoutId]?.[workoutExerciseId];
  const curSetsSafe = curSets || [];
  // ✅ Fetch sets only if not loaded yet
  useEffect(() => {
    if (workoutId && workoutExerciseId && getExercise(workoutExerciseId).workout_id == workoutId && !curSets) {
      getSets(workoutId, workoutExerciseId);
    }
  }, [workoutId, workoutExerciseId, getExercise, getSets, curSets]);

  // ✅ Sync rest timer correctly (fix: != null)
  useEffect(() => {
    if (workoutExercise?.rest_between_sets != null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRestBetweenSets(workoutExercise.rest_between_sets);
    }
  }, [workoutExercise?.rest_between_sets]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNewReps("");
    setDuration("");
  }, [workoutExercise?.type]);



  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddSet();
    }
  };

  const handleAddSet = async () => {

    await createSet(
      type == "reps" ? newReps : duration,
      type,
      Number(newWeight),
      workoutId,
      workoutExerciseId
    );

    setNewReps("");
    setDuration("");
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
              ` • ${curSetsSafe
                .map((s) =>
                  type === "reps"
                    ? s?.reps ?? 0 // show reps if type is reps
                    : s?.duration ?? 0 // show duration if type is time
                )
                .join("-")} ${type === "reps" ? "reps" : "sec"}`}
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
            workoutExerciseId={workoutExerciseId}
            type={type}
          />
        ))}

        <div className="set-add-row">

          {type === "reps" ? (
            <>
              <input
                type="number"
                placeholder="Reps"
                value={newReps}
                onChange={(e) => setNewReps(e.target.value)}
                onKeyDown={handleKeyDown}
              />

            </>
          ) : (
            <input
              type="number"
              placeholder="Duration (sec)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              onKeyDown={handleKeyDown}
              min={0}  // optional: prevent 0 or negative
            />
          )}



          <input
            type="number"
            placeholder="Weight (kg)"
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