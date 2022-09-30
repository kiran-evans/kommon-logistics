import axios from "axios";
import { useState } from "react";
import APIError from "../popups/APIError";

const UserForm = (props) => {

    const [userType, setUserType] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [maxCarryWeight, setMaxCarryWeight] = useState();
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        let userInfo = null;
        if (maxCarryWeight) userInfo = { maxCarryWeight: maxCarryWeight };

        try {
            const res = await axios.post("http://localhost:5000/api/user", {
                userType: userType,
                username: username,
                password: password,
                name: name,
                userInfo: userInfo,
            });

            props.setDriverChange(res);
            setUsername('');
            setPassword('');
            setName('');
            setMaxCarryWeight('');
        } catch (err) {
            setErrorMsg(err);
        }
    }

    return (
        <div className="userForm">
            <h1>Create New User</h1>
            <form onSubmit={e => handleSubmit(e)}>
                <label htmlFor="userType">Account Type</label>
                <select required name="userType" onChange={e => setUserType(e.target.value)} defaultValue='Default'>
                    <option disabled hidden value='Default'>Select account type</option>
                    <option value='Driver'>Driver</option>
                    <option value='Manager'>Manager</option>
                </select>

                <h2>Login details</h2>

                <label htmlFor="username">Username</label>
                <input required type="username" name="username" placeholder="e.g. joe.bloggs" value={username} onChange={e => setUsername(e.target.value)} />

                <label htmlFor="password">Password</label>
                <input required type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

                <h2>Personal details</h2>

                <label htmlFor="name">Name</label>
                <input required type="text" name="name" placeholder="e.g. Joe Bloggs" value={name} onChange={e => setName(e.target.value)} />

                {(userType === 'Driver') && 
                    <>
                        <label htmlFor="maxCarryWeight">Max. carry weight / kg</label>
                        <input required type="number" name="maxCarryWeight" placeholder="e.g. 1500" value={maxCarryWeight} onChange={e => setMaxCarryWeight(e.target.value)} />
                    </>
                }


                <button type="submit">Create user</button>
            </form>
            {errorMsg && <APIError errorMsg={errorMsg} />}
        </div>
    )
}

export default UserForm;