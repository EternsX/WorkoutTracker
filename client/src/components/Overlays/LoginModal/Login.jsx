import "./Login.css";
import { useState, useRef, useEffect } from "react";
import useOverlay from "../../../context/UIOverlay/useOverlay";
import useAuth from "../../../context/Auth/useAuth";
import { MODAL_TYPES } from "../../../constants/modalTypes";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { useIsMobile } from "../../../utils/isMobile";

export default function Login() {
    const { overlays, closeOverlay, openOverlay } = useOverlay();
    const { login, loading, error } = useAuth(); // use context for loading & error
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const loginIsOpen = overlays.some((o) => o.type === MODAL_TYPES.LOGIN);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const usernameRef = useRef(null);

    // Reset form when modal opens
    useEffect(() => {
        if (loginIsOpen && !isMobile) {
            usernameRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPassword("");
        setUsername("");
    }, [loginIsOpen, isMobile]);

    const handleLogin = async () => {
        if (loading) return; // prevent double submit
        const res = await login(username, password);
        if (res?.success) {
            closeOverlay(MODAL_TYPES.LOGIN);
            navigate("/", { replace: true });
        }
    };

    const handleOpenRegister = () => {
        closeOverlay(MODAL_TYPES.LOGIN);
        openOverlay({ type: MODAL_TYPES.REGISTER });
    };
    if (!loginIsOpen) return null;

    return (
        <Modal type={MODAL_TYPES.LOGIN}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
                className="form"
            >
                <h2 className="title">Login</h2>

                <div className="input-group">
                    <input
                        ref={usernameRef}
                        autoComplete="username"
                        placeholder=" "
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>Username</label>
                    {error?.username && <div className="error">{error.username}</div>}
                </div>

                <div className="input-group">
                    <input
                        placeholder=" "
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Password</label>
                    {error?.password && <div className="error">{error.password}</div>}
                </div>
                {error?.general && <div className="error">{error.general}</div>}

                <button className="button" disabled={loading} type="submit">
                    {loading ? <span className="spinner"></span> : "Login"}
                </button>

                <p className="switch-text">
                    Don't have an account?{" "}
                    <span className="switch-link" onClick={handleOpenRegister}>
                        Register
                    </span>
                </p>
            </form>
        </Modal>
    );
}