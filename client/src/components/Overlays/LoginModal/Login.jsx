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
    const { login } = useAuth();
    const navigate = useNavigate();
    const isMobile = useIsMobile();


    const loginIsOpen = overlays.some((o) => o.type === MODAL_TYPES.LOGIN);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const usernameRef = useRef(null);

    useEffect(() => {
        if (loginIsOpen && !isMobile) {
            usernameRef.current?.focus();
        }
        setPassword("");
        setUsername("");
        setError("");
    }, [loginIsOpen, isMobile]);

    const handleLogin = async () => {
        setError("");

        if (!username || !password) {
            setError("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const res = await login(username, password);

            if (!res?.success) {
                setError(res?.error || "Login failed");
                return;
            }

            closeOverlay(MODAL_TYPES.LOGIN);
            navigate("/", { replace: true });

        } catch (err) {
            setError("Server error");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 NEW: switch to register modal
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
                </div>

                {error && <div className="error">{error}</div>}

                <button className="button" disabled={loading} type="submit">
                    {loading ? <span className="spinner"></span> : "Login"}
                </button>

                {/* 🔥 NEW: switch to register */}
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