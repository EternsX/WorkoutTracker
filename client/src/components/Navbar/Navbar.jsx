import { Settings, Dumbbell } from "lucide-react";
import "./Navbar.css";
import NavButton from "./NavButton/NavButton";
import useOverlay from "../../context/UIOverlay/useOverlay";
import { MODAL_TYPES } from "../../constants/modalTypes";

export default function Navbar({ openWorkoutSidebar }) {
  const { openOverlay } = useOverlay();

  const handleOpenSettings = () => {
    openOverlay({ type: MODAL_TYPES.SETTINGS });
  };

  return (
    <div className="navbar">
      <div className="options">
        <NavButton
          onClick={openWorkoutSidebar}
          text={<Dumbbell size={20} color="#8ab4ff" />}
        />
      </div>

      <span className="title">Workout Tracker</span>

      <div className="settings">
        <NavButton
          onClick={handleOpenSettings}
          text={<Settings size={20} color="#8ab4ff" />}
        />
      </div>
    </div>
  );
}