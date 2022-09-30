import { CircularProgress } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginCall } from "../../context/APICalls";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { isFetching, error, dispatch } = useContext(AuthContext);
    const navigator = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        await loginCall({
            username: username,
            password: password,
        }, dispatch);

        return navigator('/dashboard');
    }

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={e => submitHandler(e)} className="loginForm">
                <label htmlFor="username">Username</label>
                <input type="username" name="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />

                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

                {isFetching ? <button type="button" disabled><CircularProgress /></button> : <button type="submit">Login</button>}
            </form>
        </div>
    )
}

export default Login;