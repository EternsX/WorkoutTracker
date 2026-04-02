import { useContext } from "react";
import ProgressContext from "./ProgressContext";

export default function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside a ProgressProvider");
  return context;
}
