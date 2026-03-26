import { useContext } from "react";
import HistoryContext from "./HistoryContext";

export default function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) throw new Error("useHistory must be used inside a History Provider");
  return context;
}
