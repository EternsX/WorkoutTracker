import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useWorkout from '../../context/Workouts/useWorkout';
import './Workouts.css';

export default function Workouts() {
  const { workouts, delWorkout, updateWorkout } = useWorkout();

  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null); // for the dots menu
  const menuRef = useRef(null);
  const inputRef = useRef(null);



  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingId]);

  const startEditing = (workout) => {
    setEditingId(workout.id);
    setEditedName(workout.name);
    setActiveMenuId(null); // close menu
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedName("");
  };

  const handleUpdate = async (id) => {
    if (!editedName.trim()) return;
    await updateWorkout(id, editedName.trim());
    setEditingId(null);
    setEditedName("");
  };

  const toggleMenu = (id) => {
    setActiveMenuId(prev => (prev === id ? null : id));
  };

  const handleDelete = (id) => {
    delWorkout(id);
    setActiveMenuId(null);
  };

  return (
    <div className="workouts-list" ref={menuRef}>
      {workouts.map((w) => (
        <div key={w.id} className="workout-item-wrapper">
          {editingId === w.id ? (
            <div className="workout-editing">
              <input
                ref={inputRef}
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
              <button onClick={() => handleUpdate(w.id)}>Save</button>
              <button onClick={cancelEditing}>Cancel</button>
            </div>
          ) : (
            <div className="workout-item">
              <Link to={`/workouts/${w.id}`} className="workout-link">
                {w.name}
              </Link>

              <div className="dots-menu-wrapper">
                <span className="dots" onClick={() => toggleMenu(w.id)}>⋮</span>
                {activeMenuId === w.id && (
                  <div className="dots-menu">
                    <button onClick={() => startEditing(w)}>Edit</button>
                    <button onClick={() => handleDelete(w.id)}>Delete</button>                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}