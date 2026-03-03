import './CreateWorkoutModal.css'
import { useEffect, useState, useRef } from 'react';
import useOverlay from '../../../context/UIOverlay/useOverlay';

export default function CreateWorkoutModal() {
    const { closeCreateWorkoutModal, createWorkoutModalIsOpen } = useOverlay();
    const [workout, setWorkout] = useState("");
    const workoutRef = useRef(null);

    useEffect(() => {
        if (createWorkoutModalIsOpen) {

            workoutRef.current.focus()
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setWorkout(() => "");
        }
    }, [createWorkoutModalIsOpen])

    const handleSubmit = (e) => {
        e.preventDefault();

        closeCreateWorkoutModal();
    }

    return (
        <div className={`create_workout-overlay-backdrop ${createWorkoutModalIsOpen ? "show" : ""}`} onClick={closeCreateWorkoutModal} >
            <div className={`create_workout-overlay-panel ${createWorkoutModalIsOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
                <h2 className='create_workout-title'>Create Your Workout</h2>
                <form action="" className='create_workout-form' onSubmit={(e) => handleSubmit(e)}>
                    <div className='create_workout-input-block'>

                        <input ref={workoutRef} onChange={(e) => setWorkout(e.target.value)} value={workout} id="workout" type="text" placeholder=" " />
                        <label htmlFor="workout">Workout</label>
                    </div>
                    <button type='submit' className='create_workout-button'>
                        Create
                    </button>
                </form>
            </div>
        </div>
    )
}