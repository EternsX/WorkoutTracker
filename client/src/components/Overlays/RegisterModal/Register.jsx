import "./Register.css";
import { useEffect, useState, useRef } from "react";
import useOverlay from "../../../context/UIOverlay/useOverlay";
import useAuth from "../../../context/Auth/useAuth";
import { MODAL_TYPES } from "../../../constants/modalTypes";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { useIsMobile } from "../../../utils/isMobile";
import { ToggleEye } from "../../../utils/ToggleEye.jsx";

export default function Register() {
    const { overlays, closeOverlay, openOverlay } = useOverlay();
    const { register, loading, error } = useAuth(); // ✅ use context state
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const registerIsOpen = overlays.some((o) => o.type === MODAL_TYPES.REGISTER);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const usernameRef = useRef(null);

    // Reset form when modal opens
    useEffect(() => {
        if (registerIsOpen && !isMobile) {
            usernameRef.current?.focus();
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPassword("");
        setUsername("");
    }, [registerIsOpen, isMobile]);

    const handleRegister = async () => {
        if (loading) return; // prevent double submit

        const res = await register(username, email, password);

        if (res?.success) {
            closeOverlay(MODAL_TYPES.REGISTER);
            navigate("/", { replace: true });
        }
    };

    const handleOpenLogin = () => {
        closeOverlay(MODAL_TYPES.REGISTER);
        openOverlay({ type: MODAL_TYPES.LOGIN });
    };

    if (!registerIsOpen) return null;

    return (
        <Modal type={MODAL_TYPES.REGISTER}>
            <form
                className="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                }}
            >
                <h2 className="title">Register</h2>

                <div className="input-group">
                    <input
                        id="username"
                        ref={usernameRef}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="off"
                        name="username"
                        placeholder=" "
                    />
                    <label htmlFor="username">Username</label>
                    {error?.username && <div className="error-text"><span className="error-symbol">*</span>{error.username}</div>}
                </div>

                <div className="input-group">
                    <input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        name="email"
                        placeholder=" "
                    />
                    <label htmlFor="email">Email</label>
                    {error?.email && <div className="error-text"><span className="error-symbol">*</span>{error.email}</div>}
                </div>

                <div className="input-group">
                    <input
                        id="new-password"
                        type={passwordVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        name="new-password"
                        placeholder=" "
                    />
                    <label htmlFor="new-password">Password</label>
                    <ToggleEye passwordVisible={passwordVisible} setPasswordVisible={setPasswordVisible} />
                    {error?.password && <div className="error-text"><span className="error-symbol">*</span>{error.password}</div>}
                </div>

                {error?.general && <div className="error">{error.general}</div>}

                <button type="submit" disabled={loading} className="button">
                    {loading ? <span className="spinner"></span> : "Register"}
                </button>

                <p className="switch-text">
                    Already have an account?{" "}
                    <span className="switch-link" onClick={handleOpenLogin}>
                        Login
                    </span>
                </p>
            </form>
        </Modal>
    );
}