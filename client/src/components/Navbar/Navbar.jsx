import { Settings, Dumbbell } from "lucide-react";
import './Navbar.css'
import NavButton from './NavButton/NavButton'
import useSidebar from '../../context/UIOverlay/useOverlay'

export default function Navbar() {
    const { openSettings, openWorkoutPanel } = useSidebar()
    return (
        <div className="navbar">
            <div className="options">
                <NavButton
                    onClick={openWorkoutPanel}
                    text={<Dumbbell size={20} color="#8ab4ff" />}
                />
            </div>

            <span className="title">Workout Tracker</span>

            <div className="settings">
                <NavButton 
                    onClick={openSettings} 
                    text={<Settings size={20} color="#8ab4ff" />} 
                />
            </div>
        </div>
    )
}