import { useNavigate } from "react-router-dom";
import { Settings, Dumbbell } from "lucide-react";
import "./Navbar.css";
import NavButton from "./NavButton/NavButton";
import useOverlay from "../../context/UIOverlay/useOverlay";
import { MODAL_TYPES } from "../../constants/modalTypes";

export default function Navbar({ openWorkoutSidebar }) {
  const { openOverlay } = useOverlay();
  const navigate = useNavigate();

  const handleOpenSettings = () => {
    openOverlay({ type: MODAL_TYPES.SETTINGS });
  };

  const handleGoHome = () => {
    navigate("/"); // Navigate to the dashboard/home
  };

  return (
    <div className="navbar">
      <div className="options">
        <NavButton
          onClick={openWorkoutSidebar}
          text={<Dumbbell size={20} color="#8ab4ff" />}
        />
      </div>

      {/* ✅ Make the title clickable */}
      <span className="title" onClick={handleGoHome} style={{ cursor: "pointer" }}>
        Workout Tracker
      </span>

      <div className="settings">
        <NavButton
          onClick={handleOpenSettings}
          text={<Settings size={20} color="#8ab4ff" />}
        />
      </div>
    </div>
  );
}