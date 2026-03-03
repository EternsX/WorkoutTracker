import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import OverlayProdvider from './context/UIOverlay/OverlayProvider.jsx'
import AuthProvider from './context/Auth/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <OverlayProdvider>
        <App />
      </OverlayProdvider>
    </AuthProvider>
  </StrictMode>
)
