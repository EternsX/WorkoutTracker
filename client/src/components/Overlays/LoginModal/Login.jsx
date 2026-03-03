import './Login.css'
import { useState, useRef, useEffect } from 'react'
import useOverlay from '../../../context/UIOverlay/useOverlay'
import useAuth from '../../../context/Auth/useAuth';

export default function Login() {
    const { loginIsOpen, closeLogin } = useOverlay();
    const { login } = useAuth();

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const usernameRef = useRef(null);


    useEffect(() => {
        if (loginIsOpen) {
            usernameRef.current.focus();
            setPassword("")
            setUsername("")
            setError("")
        }
    }, [loginIsOpen]);

    const handleLogin = async () => {
        setError("");

        if (!username || !password) {
            setError("Please fill all fields");
            return;
        }

        try {
            setLoading(true);

            console.time("login request");
            const res = await login(username, password);
            console.timeEnd("login request");

            if (!res?.success) {
                setError(res?.error || "Login failed");
                return;
            }

            closeLogin();
        } catch (err) {
            setError("Server error");
            console.log(err)
        } finally {
            setLoading(false);
        }
    };




    return (
        <div
            className={`l-overlay-backdrop ${loginIsOpen ? "show" : ""}`}
            onClick={closeLogin}
        >
            <div
                className={`l-overlay-panel ${loginIsOpen ? "open" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                <form action="" onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
                    className='l-form'
                >
                    <h2 className="l-title">Login</h2>

                    {/* Floating input */}
                    <div className="l-input-group">
                        <input
                            ref={usernameRef}
                            autoComplete='username'
                            placeholder=" "
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label>Username</label>
                    </div>

                    <div className="l-input-group">
                        <input
                            placeholder=" "
                            type="password"
                            autoComplete='current-password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label>Password</label>
                    </div>

                    {error && <div className="l-error">{error}</div>}

                    <button
                        className="l-button"
                        disabled={loading}
                        type='submit'
                    >
                        {loading ? <span className="spinner"></span> : "Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}