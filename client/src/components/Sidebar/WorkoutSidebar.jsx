import "./WorkoutSidebar.css";
import useOverlay from "../../context/UIOverlay/useOverlay";
import useWorkout from "../../context/Workouts/useWorkout";
import useAuth from "../../context/Auth/useAuth";
import Workouts from "../Workouts/Workouts";
import { MODAL_TYPES } from "../../constants/modalTypes";

export default function WorkoutSidebar({ workoutSidebarIsOpen, closeWorkoutSidebar }) {
    const { openOverlay } = useOverlay();
    const { workouts } = useWorkout();
    const { user } = useAuth();

    const handleAddWorkout = () => {
        // ❌ not logged in → open login modal
        if (!user) {
            openOverlay({ type: MODAL_TYPES.LOGIN });
            return;
        }

        // ✅ logged in → open create workout modal
        openOverlay({ type: MODAL_TYPES.CREATE_WORKOUT });
    };

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
                    onClick={handleAddWorkout}
                >
                    + Add Workout
                </button>

                {workouts && workouts.length > 0 ? (
                    <Workouts workouts={workouts} />
                ) : (
                    <p className="empty-message">
                        {user 
                          ? "No workouts yet. Add one!" 
                          : "Login to create workouts"}
                    </p>
                )}
            </div>
        </div>
    );
}