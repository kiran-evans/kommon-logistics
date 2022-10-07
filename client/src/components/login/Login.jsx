import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginCall } from "../../context/APICalls";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {

    const API_URL = import.meta.env.VITE_API_URL;

    const { isFetching, dispatch, error } = useContext(AuthContext);
    const navigator = useNavigate();

    const [isLoading, setIsLoading] = useState(isFetching);
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (error) setFormError(error.response.data.message);
    }, []);

    useEffect(() => {
        if (error) setFormError(error.response.data.message);
    }, [error]);

    const [forgotLogin, setForgotLogin] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const loginHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        await loginCall({
            username: username,
            password: password,
        }, dispatch);
        setIsLoading(false);
        return navigator('/dashboard');
    }

    const forgotLoginHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.get(`${API_URL}/user?email=${email}`);
            await axios.post(`${API_URL}/user/forgotLogin`, { email: email });
            setIsLoading(false);
            setForgotLogin(false);
            setEmail('');
            return setFormError(`Check your email for a link to reset your password`);
        } catch (err) {
            setFormError(err.response.data.message);
            return setIsLoading(false);
        }
    }

    return (
        <div className="login">
            <h2>Login</h2>
            {!forgotLogin ?
                <form onSubmit={e => loginHandler(e)} >
                    <fieldset>
                        <label htmlFor="username">Username</label>
                        <input type="username" autoComplete="username" name="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                    </fieldset>

                    <fieldset>
                        <label htmlFor="password">Password</label>
                        <input type="password" autoComplete="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </fieldset>

                    {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button type="submit">Login</button>}
                    {formError && <div className="formError">{formError}</div>}
                    <a><p onClick={() => setForgotLogin(true)}>Forgot password</p></a>
                </form>
            :
                <form onSubmit={e => forgotLoginHandler(e)}>
                    <fieldset>
                        <label htmlFor="email">Please enter your email address</label>
                        <input type="email" name="email" autoComplete="email" placeholder="e.g. joe.bloggs@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </fieldset>

                    {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button type="submit">Submit</button>}
                    {formError && <div className="formError">{formError}</div>}
                </form>
            }
        </div>
    )
}

export default Login;