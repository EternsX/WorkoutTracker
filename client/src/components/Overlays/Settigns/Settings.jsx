import "./Settings.css";
import useOverlay from "../../../context/UIOverlay/useOverlay";
import SButton from "./SettingsButton/SButton";
import useAuth from "../../../context/Auth/useAuth";
import { MODAL_TYPES } from "../../../constants/modalTypes";
import { useNavigate } from "react-router-dom";


export default function Settings() {
  const { overlays, openOverlay, closeOverlay } = useOverlay();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Check if SETTINGS overlay is in the stack
  const settingsIsOpen = overlays.some((o) => o.type === MODAL_TYPES.SETTINGS);

  const handleLogout = async () => {
    await logout();
    closeOverlay(MODAL_TYPES.SETTINGS);
    navigate("/", { replace: true });
  };
  
  
  if (!settingsIsOpen) return null;

  return (
    <div
      className={`s-overlay-backdrop ${settingsIsOpen ? "show" : ""}`}
      onClick={() => closeOverlay(MODAL_TYPES.SETTINGS)} // close only settings
    >
      <div
        className={`s-overlay-panel ${settingsIsOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {!user ? (
          <>
            <SButton
              text="Log in"
              onClick={() => openOverlay({ type: MODAL_TYPES.LOGIN })}
            />
            <SButton
              text="Register"
              onClick={() => openOverlay({ type: MODAL_TYPES.REGISTER })}
            />
          </>
        ) : (
          <>
          <SButton text="Log out" onClick={handleLogout} />
          <SButton text="Workout History" onClick={() => navigate('/history')}/>
          </>
        )}
      </div>
    </div>
  );
}