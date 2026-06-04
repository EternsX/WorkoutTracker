import { Eye, EyeOff } from "lucide-react";

export const ToggleEye = ({ passwordVisible, setPasswordVisible }) => {
    return (
        <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="toggle-password"
        >
            {passwordVisible ? <EyeOff /> : <Eye />}
        </button>
    );
};