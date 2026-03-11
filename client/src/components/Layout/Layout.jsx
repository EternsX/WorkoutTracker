import Navbar from "../Navbar/Navbar"
import Overlays from "../Overlays/Overlays"
import { useState } from "react"
import WorkoutSidebar from "../Sidebar/WorkoutSidebar"
import { Outlet } from "react-router-dom";

export default function Layout() {
    const [workoutSidebarIsOpen, setWorkoutSidebarIsOpen] = useState(false)

    const openWorkoutSidebar = () => {
        setWorkoutSidebarIsOpen(true)};
    const closeWorkoutSidebar = () => setWorkoutSidebarIsOpen(false);

    return (
        <>
            <Navbar openWorkoutSidebar={openWorkoutSidebar} />
            <WorkoutSidebar workoutSidebarIsOpen={workoutSidebarIsOpen} closeWorkoutSidebar={closeWorkoutSidebar} />
            <Outlet />


            <Overlays />
        </>
    )
}