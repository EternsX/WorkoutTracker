import { useState } from "react";
import useSet from "../../../context/Sets/useSet";
import "./Set.css";
import TooltipButton from "../../UI/TooltipButton";
import useExercise from "../../../context/Exercises/useExercise";

export default function Set({
    set,
    i,
    workoutId,
    workoutExerciseId,
}) {
    const { updateSet, deleteSet } = useSet();
    const [editing, setEditing] = useState(false);
    const { getExercise } = useExercise();

    const exercise = getExercise(workoutExerciseId);
    const type = exercise?.type || "reps"; // default to "reps" if not setä
    // Track both reps and duration in form
    const [form, setForm] = useState({
        reps: set?.reps ?? 0,
        duration: set?.duration ?? 0,
        weight: set?.weight ?? 0,
    });

    // Start editing: initialize form
    const startEditing = (e) => {
        e.stopPropagation();
        setForm({
            reps: set?.reps ?? 0,
            duration: set?.duration ?? 0,
            weight: set?.weight ?? 0,
        });
        setEditing(true);
    };

    // Handle input changes
    const handleChange = (field) => (e) => {
        setForm((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    // Save updated set
    const handleSave = async (e) => {
        e.stopPropagation();

        // Convert 0 to null to respect backend validation
        const reps = Number(form.reps) || null;
        const duration = Number(form.duration) || null;
        const weight = Number(form.weight) || 0;

        await updateSet(
            set.id,
            type == "reps" ? reps : duration,
            weight,
            type == "reps" ? "reps" : "time",
            workoutId,
            workoutExerciseId
        );
        setEditing(false);
    };

    // Cancel editing
    const handleCancel = (e) => {
        e.stopPropagation();
        setForm({
            reps: set?.reps ?? 0,
            duration: set?.duration ?? 0,
            weight: set?.weight ?? 0,
        });
        setEditing(false);
    };

    // Enter key to save
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSave(e);
    };

    // Delete set
    const handleDelete = async (e) => {
        e.stopPropagation();
        await deleteSet(set.id, workoutId, workoutExerciseId);
    };

    return (
        <div className="set-row">
            {editing ? (
                <>
                    <span>Set {i + 1}</span>
                    {type === "reps" ? (
                        <input
                            type="number"
                            className="set-input"
                            placeholder="Reps"
                            value={form.reps}
                            onChange={handleChange("reps")}
                            onKeyDown={handleKeyDown}
                            min={0}
                        />
                    ) : (
                        <input
                            type="number"
                            className="set-input"
                            placeholder="Duration (sec)"
                            value={form.duration}
                            onChange={handleChange("duration")}
                            onKeyDown={handleKeyDown}
                            min={0}
                        />
                    )}

                    <input
                        type="number"
                        className="set-input"
                        placeholder="Weight (kg)"
                        value={form.weight}
                        onChange={handleChange("weight")}
                        onKeyDown={handleKeyDown}
                        min={0}
                    />

                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </>
            ) : (
                <>
                    <span>Set {i + 1}</span>

                    {type === "reps" ? (
                        <span>{set?.reps ?? 0} reps</span>
                    ) : (
                        <span>{set?.duration ?? 0} sec</span>
                    )}

                    <span>{set?.weight ?? 0} kg</span>

                    <div className="set-actions" onClick={(e) => e.stopPropagation()}>
                        <TooltipButton
                            className="set-action-button"
                            label="Edit"
                            onClick={startEditing}
                        >
                            ✏️
                        </TooltipButton>

                        <TooltipButton
                            className="set-action-button"
                            label="Delete"
                            onClick={handleDelete}
                        >
                            🗑️
                        </TooltipButton>
                    </div>
                </>
            )}
        </div>
    );
}