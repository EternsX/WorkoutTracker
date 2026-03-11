import "./WorkoutSidebar.css";
import useOverlay from "../../context/UIOverlay/useOverlay";
import useWorkout from "../../context/Workouts/useWorkout";
import Workouts from "../Workouts/Workouts";
import { MODAL_TYPES } from "../../constants/modalTypes";

export default function WorkoutSidebar({ workoutSidebarIsOpen, closeWorkoutSidebar }) {
    const { openOverlay } = useOverlay();
    const { workouts } = useWorkout();

    return (
        <div
            className={`workout-sidebar-backdrop ${workoutSidebarIsOpen ? "show" : ""}`}
            onClick={closeWorkoutSidebar}
        >
            <div
                className={`workout-sidebar-panel ${workoutSidebarIsOpen ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="add-workout"
                    onClick={() => openOverlay({ type: MODAL_TYPES.CREATE_WORKOUT })}
                >
                    Add a Workout
                </button>
                <Workouts workouts={workouts} />
            </div>
        </div>
    );
}