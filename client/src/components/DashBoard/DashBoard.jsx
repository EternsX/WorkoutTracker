import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useWorkout from '../../context/Workouts/useWorkout';
import useSession from "../../context/Session/useSession";
import useOverlay from "../../context/UIOverlay/useOverlay";
import useAuth from "../../context/Auth/useAuth";
import { MODAL_TYPES } from "../../constants/modalTypes";
import './Dashboard.css';

export default function Dashboard() {
  const { workouts, getWorkout } = useWorkout();
  const { session, getSession } = useSession();
  const { openOverlay } = useOverlay();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCreateWorkout = () => {
    if (!user) {
      openOverlay({ type: MODAL_TYPES.LOGIN });
      return;
    }
    openOverlay({ type: MODAL_TYPES.CREATE_WORKOUT });
  };

  useEffect(() => {
    if (user) {
      getSession(user.workout_id);
    }
  }, [user, getSession]);
  console.log(session)

  return (
    <div className="dashboard-container">
      {session ? (
        <div className="dashboard-card">
          <h2 className="dashboard-title">🏋️ You have an ongoing workout:</h2>
          <p className="dashboard-subtitle">
            {getWorkout(session.workout_id)?.name}
          </p>
          <button
            className="dashboard-button dashboard-primary-button"
            onClick={() => navigate(`/workouts/${session.workout_id}`)}
          >
            Continue Workout
          </button>
        </div>
      ) : (
        <div className="dashboard-card">
          <h2 className="dashboard-title">
            {workouts && workouts.length > 0
              ? "Select a workout from the sidebar"
              : "Create your first workout!"}
          </h2>

          {(!workouts || workouts.length === 0) && (
            <button
              className="dashboard-button dashboard-primary-button"
              onClick={handleCreateWorkout}
            >
              + Create Workout
            </button>
          )}
        </div>
      )}
    </div>
  );
}