import { useContext } from "react";
import SetContext from "./SetContext";

export default function useSet() {
  const context = useContext(SetContext);
  if (!context) throw new Error("useModal must be used inside a ModalProvider");
  return context;
}
