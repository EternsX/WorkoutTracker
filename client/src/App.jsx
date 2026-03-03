import './App.css'
import Navbar from './components/Navbar/Navbar'
import Settings from './components/Overlays/Settigns/Settings'
import Login from './components/Overlays/LoginModal/Login'
import Register from './components/Overlays/RegisterModal/Register'
import WorkoutPanel from './components/Overlays/WorkoutPanel/WorkoutPanel'
import CreateWorkoutModal from './components/Overlays/CreateWorkoutModal/CreateWorkoutModal'

function App() {
  return (
    <>
      <Navbar />
      <Settings />
      <WorkoutPanel />
      <Login />
      <Register />
      <CreateWorkoutModal />
    </>
  )
}

export default App
