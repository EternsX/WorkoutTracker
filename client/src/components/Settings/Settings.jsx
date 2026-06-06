import './Settings.css';
import useAuth from '../../context/Auth/useAuth';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function Settings() {
    const { user, updateUsername, updateEmail, loading, error } = useAuth();
    const [email, setEmail] = useState(user?.email || '');
    const [username, setUsername] = useState(user?.username || '');

    const [editingUsername, setEditingUsername] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUsername(user.username || '');
            setEmail(user.email || '');
        }
    }, [user]);

    const handleUsernameSave = async () => {
        const result = await updateUsername(username);
        if (result.success) {
            setEditingUsername(false);
        }
    };

    const handleEmailSave = async () => {
        const result = await updateEmail(email);
        if (result.success) {
            setEditingEmail(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="settings-container">
            <h2 className="settings-title">Account Settings</h2>
            <div className="settings-info">
                <h4 className="settings-label">Username:</h4>
                <div className="settings-controls">
                    <input className="settings-input" value={username} onChange={(e) => setUsername(e.target.value)} readOnly={!editingUsername} />
                    <button onClick={() => editingUsername ? handleUsernameSave() : setEditingUsername((prev) => !prev)}>
                        {editingUsername ? 'Save' : 'Edit'}
                    </button>
                    {error?.key == 'username' ? <span className="error-message">{error.message}</span> : null}
                </div>
            </div>
            <div className="settings-info">
                <h4 className="settings-label">Email:</h4>
                <div className="settings-controls">
                    <input className="settings-input" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={!editingEmail} />
                    <button onClick={() => editingEmail ? handleEmailSave() : setEditingEmail((prev) => !prev)}>
                        {editingEmail ? 'Save' : 'Edit'}
                    </button>
                </div>
                {error?.key == 'email' ? <span className="error-message">{error.message}</span> : null}
                {!user?.verified && user?.email ? <span className="unverified-email">Email not verified</span> : null}
                {user?.email || '' ? null : <span className="missing-email">Add your email</span>}
            </div>

        </div>
    );
}

export default Settings;