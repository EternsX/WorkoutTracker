import "./Register.css";
import { useEffect, useState, useRef } from "react";
import useOverlay from "../../../context/UIOverlay/useOverlay";
import useAuth from "../../../context/Auth/useAuth";
import { MODAL_TYPES } from "../../../constants/modalTypes"; // adjust path if you move it to constants
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { useIsMobile } from "../../../utils/isMobile";

export default function Register() {
    const { overlays, closeOverlay } = useOverlay();
    const { register } = useAuth();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const registerIsOpen = overlays.some((o) => o.type === MODAL_TYPES.REGISTER);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const usernameRef = useRef(null);

    useEffect(() => {
        if (registerIsOpen && !isMobile) {
            usernameRef.current?.focus();
        }
        setPassword("");
        setUsername("");
        setError("");
    }, [registerIsOpen, isMobile]);

    const handleChange = (e, setValue) => {
        setValue(e.target.value);
    };

    const handleRegister = async () => {
        setError("");

        if (!username || !password) {
            setError("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            const res = await register(username, password);

            if (!res?.success) {
                setError(res?.error || "Register failed");
                return;
            }

            closeOverlay(MODAL_TYPES.REGISTER)
            navigate("/", { replace: true });
        } catch (err) {
            setError("Server error");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (!registerIsOpen) return null; // optional optimization

    return (
        <Modal type={MODAL_TYPES.REGISTER}>
            <h2 className="title">Register</h2>
            <form
                className="form"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                }}
            >
                <div className="input-group">
                    <input
                        ref={usernameRef}
                        onChange={(e) => handleChange(e, setUsername)}
                        value={username}
                        id="username"
                        autoComplete="username"
                        type="text"
                        placeholder=" "
                    />
                    <label htmlFor="username">Username</label>
                </div>

                <div className="input-group">
                    <input
                        onChange={(e) => handleChange(e, setPassword)}
                        value={password}
                        id="password"
                        autoComplete="current-password"
                        type="password"
                        placeholder=" "
                    />
                    <label htmlFor="password">Password</label>
                </div>

                {error && <div className="error">{error}</div>}

                <button type="submit" disabled={loading} className="button">
                    {loading ? <span className="spinner"></span> : "Register"}
                </button>
            </form>
        </Modal>
    );
}