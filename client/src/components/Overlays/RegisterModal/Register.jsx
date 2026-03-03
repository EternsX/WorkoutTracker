import './Register.css'
import useOverlay from '../../../context/UIOverlay/useOverlay'
import { useEffect, useState, useRef } from 'react';
import useAuth from '../../../context/Auth/useAuth';

export default function Register() {
    const { registerIsOpen, closeRegister } = useOverlay();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false)
    const usernameRef = useRef(null);
    const { register } = useAuth();


    useEffect(() => {
        if (registerIsOpen) {
            usernameRef.current.focus();
            setPassword("")
            setUsername("")
            setError("")
        }
    }, [registerIsOpen]);

    const handleChange = (e, setValue) => {
        setValue(e.target.value)
    }

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

            closeRegister();
        } catch (err) {
            setError("Server error");
            console.log(err)
        } finally {
            setLoading(false);
        }
    }



    return (
        <div className={`r-overlay-backdrop ${registerIsOpen ? "show" : ""}`} onClick={closeRegister} >
            <div className={`r-overlay-panel ${registerIsOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
                <h2 className='r-title'>Register</h2>
                <form className='r-form' action="" onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                }}>
                    <div className="r-input-block">
                        <input ref={usernameRef} onChange={(e) => handleChange(e, setUsername)} value={username} id="username" autoComplete='username' type="text" placeholder=" " />
                        <label htmlFor="username">Username</label>
                    </div>

                    <div className="r-input-block">
                        <input onChange={(e) => handleChange(e, setPassword)} value={password} id="password" autoComplete='current-password' type="password" placeholder=" " />
                        <label htmlFor="password">Password</label>
                    </div>
                    {error && <div className='r-error'>{error}</div>}
                    <button type='submit' disabled={loading} className='r-button'>
                        {loading ? <span className='r-spinner'></span> : "Register"}
                    </button>
                </form>
            </div>
        </div>
    )
}