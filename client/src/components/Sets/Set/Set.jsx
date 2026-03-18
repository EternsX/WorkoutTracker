import { useState } from "react";
import useSet from "../../../context/Sets/useSet";
import './Set.css'
import TooltipButton from "../../UI/TooltipButton";

export default function Set({ set, i, workoutId, exerciseId }) {
    const { updateSet, deleteSet } = useSet();

    const [editing, setEditing] = useState(false);
    const [active, setActive] = useState(false);

    const [form, setForm] = useState({
        reps: set.reps,
        weight: set.weight,
    });

    const startEditing = (e) => {
        e.stopPropagation();
        setForm({
            reps: set.reps,
            weight: set.weight,
        });
        setEditing(true);
    };

    const handleChange = (field) => (e) => {
        setForm((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleSave = async (e) => {
        e.stopPropagation();

        await updateSet(
            set.id,
            Number(form.reps),
            Number(form.weight),
            workoutId,
            exerciseId
        );

        setEditing(false);
        setActive(false);
    };

    const handleCancel = (e) => {
        e.stopPropagation();

        setForm({
            reps: set.reps,
            weight: set.weight,
        });

        setEditing(false);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        await deleteSet(set.id, workoutId, exerciseId);
    };

    const toggleActive = () => {
        if (!editing) {
            setActive((prev) => !prev);
        }
    };

    return (
        <div className="set-row" onClick={toggleActive}>
            {editing ? (
                <>
                    <span>Set {i + 1}</span>

                    <input
                        type="number"
                        className="set-input"
                        value={form.reps}
                        onChange={handleChange("reps")}
                    />
                    <input
                        type="number"
                        className="set-input"
                        value={form.weight}
                        onChange={handleChange("weight")}
                    />

                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                </>
            ) : (
                <>
                    <span>Set {i + 1}</span>
                    <span>{set.reps} reps</span>
                    <span>{set.weight} kg</span>

                    {active && (
                        <div className="set-actions" onClick={(e) => e.stopPropagation()}>
                            <TooltipButton className="set-action-button" label="Edit" onClick={startEditing}>✏️</TooltipButton>
                            <TooltipButton className="set-action-button" label="Delete" onClick={handleDelete}>🗑️</TooltipButton>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}