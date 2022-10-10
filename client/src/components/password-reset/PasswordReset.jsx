import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PasswordReset = () => {

    const API_URL = import.meta.env.KL_API_URL;

    const [urlParams] = useSearchParams();
    const navigator = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [isValidated, setIsValidated] = useState(false);

    const [enteredNewPassword, setEnteredNewPassword] = useState('');
    const [reEnteredNewPassword, setReEnteredNewPassword] = useState('');

    useEffect(() => {
        const validateEmail = async () => {
            setIsLoading(true);
            try {
                await axios.get(`${API_URL}/user/forgotLogin?t=${urlParams.get('t')}&u=${urlParams.get('u')}`);
                setIsValidated(true);
                return setIsLoading(false);
            } catch (err) {
                setFormError(err.response.data.message);
                return setIsLoading(false);
            }
        }
        validateEmail();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (enteredNewPassword !== reEnteredNewPassword) return setFormError(`Please make sure passwords match.`);

        try {
            await axios.put(`${API_URL}/user?id=${urlParams.get('u')}`, {
                password: enteredNewPassword
            });
            setIsLoading(false);
            return navigator('/');
        } catch (err) {
            setIsLoading(false);
            return setFormError(err.response.data.message);
        }
    }

    return (
        <div className="passwordReset">
            {formError && <div className="formError">{formError}</div>}
            {isValidated && 
                <form onSubmit={e => handleSubmit(e)}>
                    <fieldset>
                        <label htmlFor="enteredPassword">Enter new password</label>
                        <input required type="password" name="enteredPassword" autoComplete="new-password" placeholder="New password" value={enteredNewPassword} onChange={e => setEnteredNewPassword(e.target.value)} />
                        
                        <label htmlFor="reEnteredPassword">Re-enter new password</label>
                        <input required type="password" name="reEnteredPassword" autoComplete="new-password" placeholder="New password" value={reEnteredNewPassword} onChange={e => setReEnteredNewPassword(e.target.value)} />
                    </fieldset>

                {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button type="submit">Submit</button>}
                </form>
            }
        </div>
    )
}

export default PasswordReset;