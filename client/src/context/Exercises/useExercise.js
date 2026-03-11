import { useContext } from "react";
import ExerciseContext from "./ExerciseContext";

export default function useExercise() {
  const context = useContext(ExerciseContext);
  if (!context) throw new Error("useModal must be used inside a ModalProvider");
  return context;
}
