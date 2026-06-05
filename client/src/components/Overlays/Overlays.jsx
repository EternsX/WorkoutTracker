import Login from './LoginModal/Login'
import Register from './RegisterModal/Register'
import CreateWorkoutModal from './CreateWorkoutModal/CreateWorkoutModal'
import CreateExerciseModal from './CreateExerciseModal/CreateExerciseModal'
import WorkoutModal from './WorkoutModal/WorkoutModal'
import ConflictWorkoutModal from './ConflictWorkoutModal/ConflictWorkoutModal'
import Options from './Options/Options'

export default function Overlays() {
    return (
        <>
            <Options />
            <Login />
            <Register />
            <CreateWorkoutModal />
            <CreateExerciseModal />
            <WorkoutModal />
            <ConflictWorkoutModal />
        </>
    )
}