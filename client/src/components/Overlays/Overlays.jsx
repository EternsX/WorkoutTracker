import Settings from './Settigns/Settings'
import Login from './LoginModal/Login'
import Register from './RegisterModal/Register'
import CreateWorkoutModal from './CreateWorkoutModal/CreateWorkoutModal'
import CreateExerciseModal from './CreateExerciseModal/CreateExerciseModal'
import EditExerciseModal from './EditExerciseModal/EditExerciseModal'

export default function Overlays() {
    return (
        <>
            <Settings />
            <Login />
            <Register />
            <CreateWorkoutModal />
            <CreateExerciseModal />
            <EditExerciseModal />
        </>
    )
}