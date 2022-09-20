import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DriverLogin = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigator = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const body = {
                username: username,
                password: password
            }

            const res = await axios.post("http://localhost:5000/api/driver/login", body);
            props.setCurrentUser(res.data);

        } catch (err) {
            return console.log(err);
        }

        return navigator("/driver");
    }

    return (
        <div className="login">
            <h2>Driver Login</h2>
            <form onSubmit={e => submitHandler(e)} className="loginForm">
                <label htmlFor="username">Username</label>
                <input type="username" name="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />

                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default DriverLogin;