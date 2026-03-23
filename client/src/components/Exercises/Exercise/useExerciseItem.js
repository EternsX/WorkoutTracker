// src/components/Exercise/useExerciseItem.js
import { useState, useRef, useEffect } from "react";

export default function useExerciseItem(exercise, updateExercise, delExercise) {
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const toggleMenu = (id) => setOpenMenuId((prev) => (prev === id ? null : id));

  const startEditing = () => {
    setEditingId(exercise.id);
    setEditedName(exercise.name);
    setOpenMenuId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedName("");
  };

  const handleUpdate = async () => {
    if (!editedName.trim()) return;
    await updateExercise(editedName.trim(), exercise.workout_exercise_id);
    cancelEditing();
  };

  const handleDelete = async () => {
    await delExercise(exercise.workout_exercise_id);
    setOpenMenuId(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
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
  };
}