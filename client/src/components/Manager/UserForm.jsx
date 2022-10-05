import axios from "axios";
import { useState } from "react";
import { PropTypes } from "prop-types";
import { CircularProgress } from "@mui/material";

const UserForm = (props) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [maxCarryWeight, setMaxCarryWeight] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let userInfo = null;
        if (maxCarryWeight) userInfo = { maxCarryWeight: maxCarryWeight };

        try {
            await axios.post(`${API_URL}/user`, {
                userType: userType,
                username: username,
                password: password,
                name: name,
                userInfo: userInfo,
            });

            props.setDataChange(userType);
            setUsername('');
            setPassword('');
            setName('');
            setMaxCarryWeight('');
            return setIsLoading(false);
        } catch (err) {
            return console.log(err);
        }
    }

    return (
        <div className="userForm">
            <form onSubmit={e => handleSubmit(e)}>
            <div className="formTitle">Create New User</div>
                <fieldset>
                    <label htmlFor="userType">Account Type</label>
                    <select required name="userType" onChange={e => setUserType(e.target.value)} defaultValue='Default'>
                        <option disabled hidden value='Default'>Select account type</option>
                        <option value='Driver'>Driver</option>
                        <option value='Manager'>Manager</option>
                    </select>
                </fieldset>

                <fieldset>
                    <legend>Login details</legend>

                    <label htmlFor="username">Username</label>
                    <input required type="username" name="username" placeholder="e.g. joe.bloggs" value={username} onChange={e => setUsername(e.target.value)} />

                    <label htmlFor="password">Password</label>
                    <input required type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                </fieldset>

                <fieldset>
                    <legend>Personal details</legend>

                    <label htmlFor="name">Name</label>
                    <input required type="text" name="name" placeholder="e.g. Joe Bloggs" value={name} onChange={e => setName(e.target.value)} />

                    {(userType === 'Driver') && 
                        <>
                            <label htmlFor="maxCarryWeight">Max. carry weight / kg</label>
                            <input required type="number" name="maxCarryWeight" placeholder="e.g. 1500" value={maxCarryWeight} onChange={e => setMaxCarryWeight(e.target.value)} />
                        </>
                    }
                </fieldset>


                {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button type="submit">Create delivery</button>}
            </form>
        </div>
    )
}

UserForm.propTypes = {
    setDataChange: PropTypes.func.isRequired
}

export default UserForm;