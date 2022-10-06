import { CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginCall } from "../../context/APICalls";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { dispatch, error } = useContext(AuthContext);
    const navigator = useNavigate();
    const [formError] = useState(error);

    const submitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        await loginCall({
            username: username,
            password: password,
        }, dispatch);
        setIsLoading(false);
        return navigator('/dashboard');
    }

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={e => submitHandler(e)} >
                <fieldset>
                    <label htmlFor="username">Username</label>
                    <input type="username" autoComplete="username" name="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                </fieldset>

                <fieldset>
                    <label htmlFor="password">Password</label>
                    <input type="password" autoComplete="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                </fieldset>

                {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button type="submit">Login</button>}
                {formError && <div className="formError">{formError.response.data.message}</div>}
            </form>
        </div>
    )
}

export default Login;