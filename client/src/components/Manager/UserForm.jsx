import axios from "axios";
import { useState } from "react";
import { PropTypes } from "prop-types";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

const UserForm = (props) => {
    const API_URL = import.meta.env.VITE_API_URL;

    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    
    const [userType, setUserType] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
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
                email: email,
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

    useEffect(() => {
        const generateUsername = async () => {
            setIsLoading(true);
            let usernameIsUnique = false;
            let usernameDigit = 1;

            const splitName = name.split(" "); // Split name by space

            while (!usernameIsUnique) {
                //    newUsername = first initial    + first two characters of last name         + digit
                const newUsername = (splitName[0][0] + splitName[splitName.length-1].slice(0, 2) + usernameDigit).toLowerCase();

                try {
                    const res = await axios.get(`${API_URL}/user?username=${newUsername}&checkIsUnique=true`); // If no matching username is found in the db
                    if (res.data.isUnique) {
                        usernameIsUnique = true;
                        setUsername(newUsername);
                        setIsLoading(false);
                        break;
                    }
                    usernameDigit++;
                } catch (err) {
                    setIsLoading(false);
                    setFormError(err);
                }
            }
        }
        if (name.length > 0) generateUsername();
    }, [name]);

    return (
        <div className="userForm">
            <form onSubmit={e => handleSubmit(e)}>
            <div className="formTitle">Create New User</div>
                <fieldset>
                    <label htmlFor="userType">Account Type</label>
                    <select required name="userType" autoComplete="off" onChange={e => setUserType(e.target.value)} defaultValue='Default'>
                        <option disabled hidden value='Default'>Select account type</option>
                        <option value='Driver'>Driver</option>
                        <option value='Manager'>Manager</option>
                    </select>
                </fieldset>

                <fieldset>
                    <legend>Personal details</legend>

                    <label htmlFor="name">Name</label>
                    <input required type="text" name="name" autoComplete="name" placeholder="e.g. Joe Bloggs" value={name} onChange={e => setName(e.target.value)} />
                </fieldset>

                <fieldset>
                    <legend>Account details</legend>

                    <label htmlFor="email">Email address</label>
                    <input required type="email" name="email" autoComplete="email" placeholder="e.g. joe.bloggs@email.com" value={email} onChange={e => setEmail(e.target.value)} />

                    <label htmlFor="password">Password</label>
                    <input required type="password" name="password" autoComplete="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

                    <label htmlFor="username">Username</label>
                    <input required disabled type="username" name="username" autoComplete="off" placeholder="Enter a name to generate a username" value={username} />
                </fieldset>

                {(userType === 'Driver') && 
                    <fieldset>
                        <legend>Employee details</legend>

                        <label htmlFor="maxCarryWeight">Max. carry weight / kg</label>
                        <input required type="number" name="maxCarryWeight" autoComplete="off" placeholder="e.g. 1500" value={maxCarryWeight} onChange={e => setMaxCarryWeight(e.target.value)} />
                    </fieldset>
                }


                {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button type="submit">Create user</button>}
                {formError && <div className="formError">{formError.response.data.message}</div>}
            </form>
        </div>
    )
}

UserForm.propTypes = {
    setDataChange: PropTypes.func.isRequired
}

export default UserForm;