import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import OverlayProvider from './context/UIOverlay/OverlayProvider.jsx'
import AuthProvider from './context/Auth/AuthProvider.jsx'
import WorkoutProvider from './context/Workouts/WorkoutProvider.jsx'
import ExerciseProvider from './context/Exercises/ExerciseProvider.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter >
      <AuthProvider>
        <WorkoutProvider>
          <ExerciseProvider>
            <OverlayProvider>
              <App />
            </OverlayProvider>
          </ExerciseProvider>
        </WorkoutProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
