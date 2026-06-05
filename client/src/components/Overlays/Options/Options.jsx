import "./Options.css";
import useOverlay from "../../../context/UIOverlay/useOverlay";
import OButton from "./OptionsButton/OButton";
import useAuth from "../../../context/Auth/useAuth";
import { MODAL_TYPES } from "../../../constants/modalTypes";
import { useNavigate } from "react-router-dom";


export default function Options() {
  const { overlays, openOverlay, closeOverlay } = useOverlay();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const optionsIsOpen = overlays.some((o) => o.type === MODAL_TYPES.OPTIONS);

  const handleLogout = async () => {
    await logout();
    closeOverlay(MODAL_TYPES.OPTIONS);
    navigate("/", { replace: true });
  };


  if (!optionsIsOpen) return null;

  return (
    <div
      className={`s-overlay-backdrop ${optionsIsOpen ? "show" : ""}`}
      onClick={() => closeOverlay(MODAL_TYPES.OPTIONS)} 
    >
      <div
        className={`s-overlay-panel ${optionsIsOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()} 
      >
        {!user ? (
          <>
            <OButton
              text="Log in"
              onClick={() => openOverlay({ type: MODAL_TYPES.LOGIN })}
            />
            <OButton
              text="Register"
              onClick={() => openOverlay({ type: MODAL_TYPES.REGISTER })}
            />
          </>
        ) : (
          <>
            <OButton text="Log out" onClick={handleLogout} />
            <OButton text="Workout History" onClick={() => {
              closeOverlay(MODAL_TYPES.OPTIONS);
              navigate('/history')
            }} />
            <OButton text="Progress" onClick={() => {
              closeOverlay(MODAL_TYPES.OPTIONS);
              navigate('/progress');
            }} />
            <OButton text="Settings" onClick={() => {
              closeOverlay(MODAL_TYPES.OPTIONS);
              navigate('/settings');
            }} />
          </>
        )}
      </div>
    </div>
  );
}