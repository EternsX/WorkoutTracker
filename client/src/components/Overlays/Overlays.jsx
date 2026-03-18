import Settings from './Settigns/Settings'
import Login from './LoginModal/Login'
import Register from './RegisterModal/Register'
import CreateWorkoutModal from './CreateWorkoutModal/CreateWorkoutModal'
import CreateExerciseModal from './CreateExerciseModal/CreateExerciseModal'
import WorkoutModal from './WorkoutModal/WorkoutModal'

export default function Overlays() {
    return (
        <>
            <Settings />
            <Login />
            <Register />
            <CreateWorkoutModal />
            <CreateExerciseModal />
            <WorkoutModal />
        </>
    )
}