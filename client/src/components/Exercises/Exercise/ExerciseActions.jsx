export default function ExerciseActions({ openMenuId, exercise, menuRef, toggleMenu, startEditing, handleDelete }) {
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
        </div>
      )}
    </>
  );
}