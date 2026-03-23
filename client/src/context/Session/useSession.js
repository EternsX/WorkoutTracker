import { useContext } from "react";
import SessionContext from "./SessionContext";

export default function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside a SessionProvider");
  return context;
}
