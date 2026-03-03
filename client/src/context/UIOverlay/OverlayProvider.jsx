import { useState } from "react";
import OverlayContext from "./OverlayContext";

export default function OverlayProvider({ children }) {
    const [settingsIsOpen, setSettingsIsOpen] = useState(false)
    const [workoutPanelIsOpen, setWorkoutPanelIsOpen] = useState(false)
    const [loginIsOpen, setLoginIsOpen] = useState(false)
    const [registerIsOpen, setRegisterIsOpen] = useState(false)
    const [createWorkoutModalIsOpen, setCreateWorkoutModalIsOpen] = useState(false)
  return (
    <OverlayContext.Provider
      value={{
        settingsIsOpen,
        loginIsOpen,
        registerIsOpen,
        workoutPanelIsOpen,
        createWorkoutModalIsOpen,
        openSettings: () => setSettingsIsOpen(true),
        closeSettings: () => setSettingsIsOpen(false),
        openLogin: () => setLoginIsOpen(true),
        closeLogin: () => setLoginIsOpen(false),
        openRegister: () => setRegisterIsOpen(true),
        closeRegister: () => setRegisterIsOpen(false),
        openWorkoutPanel: () => setWorkoutPanelIsOpen(true),
        closeWorkoutPanel: () => setWorkoutPanelIsOpen(false),
        openCreateWorkoutModal: () => setCreateWorkoutModalIsOpen(true),
        closeCreateWorkoutModal: () => setCreateWorkoutModalIsOpen(false),
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
}