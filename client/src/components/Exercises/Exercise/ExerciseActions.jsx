export default function ExerciseActions({ openMenuId, exercise, menuRef, toggleMenu, startEditing, handleDelete, openSwap }) {
  return (
    <>
      <button
        className="menu-btn"
        onClick={() => toggleMenu(exercise.id)}
      >
        ⋮
      </button>

      {openMenuId === exercise.id && (
        <div className="menu-dropdown" ref={menuRef}>
          <button onClick={startEditing}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={() => openSwap(exercise.workout_exercise_id)}>Swap</button>        </div>
      )}
    </>
  );
}