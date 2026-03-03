import { useContext } from "react";
import AuthContext from "./AuthContext";

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useModal must be used inside a ModalProvider");
  return context;
}
