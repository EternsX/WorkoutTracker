import { useState } from "react";
import OverlayContext from "./OverlayContext";

export default function OverlayProvider({ children }) {
  const [overlays, setOverlays] = useState([]);

  const openOverlay = (overlayConfig) => {
    setOverlays((prev) => [...prev, overlayConfig]);
  };

  const closeOverlay = (type = null) => {
    setOverlays((prev) => {
      if (type) {
        // remove a specific overlay by type
        return prev.filter((o) => o.type !== type);
      }
    });
  };

  return (
    <OverlayContext.Provider
      value={{
        overlays,
        openOverlay,
        closeOverlay,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
}