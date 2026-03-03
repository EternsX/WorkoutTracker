import './Settings.css'
import useOverlay from '../../../context/UIOverlay/useOverlay'
import SButton from './SettingsButton/SButton';
import useAuth from '../../../context/Auth/useAuth';

export default function Settings() {
    const { settingsIsOpen, closeSettings, openLogin, openRegister } = useOverlay();
    const { user, logout } = useAuth();
    return (
        <div className={`s-overlay-backdrop ${settingsIsOpen ? "show" : ""}`} onClick={closeSettings} >
            <div className={`s-overlay-panel ${settingsIsOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
                {!user ?
                    <>
                        <SButton text="Log in" onClick={openLogin} />
                        <SButton text="Register" onClick={openRegister} />
                    </>
                    :
                    <SButton text="Log out" onClick={logout}/>
                }
            </div>
        </div>
    )
}