import { Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../../context/Auth/useAuth";
import "./Validate.css";

function Validate() {
    const { verify } = useAuth();
    const { token } = useParams();

    const [validated, setValidated] = useState(null);

    useEffect(() => {
        if (!token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setValidated(false);
            return;
        }

        const validate = async () => {
            const result = await verify(token);
            if (result.error) {
                setValidated(false);
                return;
            }
            setValidated(true);
        };
        validate();
    }, [token, verify]);

    if (validated === null) {
        return <p>Validating...</p>;
    }

    return (
        <div>
            <h1 className="validate-title">
                {validated ? "Your Account Has Been Validated" : "Validation Failed"}
            </h1>
        </div>
    );
}

export default Validate;