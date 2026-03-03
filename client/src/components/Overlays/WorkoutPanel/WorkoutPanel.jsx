import './WorkoutPanel.css'
import useOverlay from '../../../context/UIOverlay/useOverlay'
// import useAuth from '../../../context/Auth/useAuth';

export default function WorkoutPanel() {
    const { workoutPanelIsOpen, closeWorkoutPanel, openCreateWorkoutModal } = useOverlay();
    // const {user} = useAuth();
    return (
        <div className={`workout-overlay-backdrop ${workoutPanelIsOpen ? "show" : ""}`} onClick={closeWorkoutPanel} >
            <div className={`workout-overlay-panel ${workoutPanelIsOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
                <button className='add-workout' onClick={openCreateWorkoutModal}>Add a Workout</button>
            </div>
        </div>
    )
}