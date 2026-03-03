import { useContext } from "react";
import OverlayContext from "./OverlayContext";

export default function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) throw new Error("useModal must be used inside a ModalProvider");
  return context;
}
