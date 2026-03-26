import "./Modal.css";
import useOverlay from "../../../context/UIOverlay/useOverlay";

export default function Modal({ type, children }) {
  const { overlays, closeOverlay } = useOverlay();

  const isOpen = overlays.some((o) => o.type === type);

  
  if (!isOpen) return null;


  return (
    <div
      className={`overlay-backdrop ${isOpen ? "show" : ""}`}
      onClick={() => closeOverlay(type)}
    >
      <div
        className={`overlay-panel ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}