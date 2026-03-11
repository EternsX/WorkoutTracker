import { useContext } from "react";
import WorkoutContext from "./WorkoutContext";

export default function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error("useModal must be used inside a ModalProvider");
  return context;
}
