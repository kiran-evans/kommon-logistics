import { CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginCall } from "../../context/APICalls";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { dispatch } = useContext(AuthContext);
    const navigator = useNavigate();

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
                    <input type="username" name="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                </fieldset>

                <fieldset>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                </fieldset>

                {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button type="submit">Login</button>}
            </form>
        </div>
    )
}

export default Login;