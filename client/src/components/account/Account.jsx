import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logoutCall } from "../../context/APICalls";
import { AuthContext } from "../../context/AuthContext";

const Account = () => {

    const API_URL = import.meta.env.VITE_API_URL;
    const { user, dispatch } = useContext(AuthContext);

    const [userInfo, setUserInfo] = useState(null);
    useEffect(() => { // Extract the values from user.userInfo into a mutable array if it exists
        if (user.userInfo) {
            // eslint-disable-next-line no-unused-vars
            const { _id, ...userInfoObject } = user.userInfo;
            setUserInfo(Object.entries(userInfoObject));
        }
    }, []);

    const navigator = useNavigate();
  
    const logout = async () => {
        await logoutCall({ user }, dispatch);
  
        return navigator('/');
    }


    const [editedUsername, setEditedUsername] = useState(user.username);
    const [enteredNewEmail, setEnteredNewEmail] = useState(user.email);
    const [reEnteredNewEmail, setReEnteredNewEmail] = useState('');
    const [editedUserType, setEditedUserType] = useState(user.userType);
    const [editedName, setEditedName] = useState(user.name);
    const [editedUserInfo, setEditedUserInfo] = useState(userInfo);
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredNewPassword, setEnteredNewPassword] = useState('');
    const [reEnteredNewPassword, setReEnteredNewPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (enteredNewEmail !== user.email && reEnteredNewEmail !== enteredNewEmail) {
            setIsLoading(false);
            return setFormError({ response: { data: { message: 'Please check your changed email address is correct' } } });
        }

        if (enteredNewPassword.length > 0 && enteredNewPassword !== reEnteredNewPassword) {
            setIsLoading(false);
            return setFormError({ response: { data: { message: 'Please check your new password is correct' } } })
        }

        try {
            await axios.post(`${API_URL}/user/login`, {
                username: user.username,
                password: enteredPassword
            });

            try {

                // eslint-disable-next-line no-unused-vars
                let { _id, ...newBody } = user;
    
                if (editedUsername !== user.username) newBody.username = editedUsername;
                if (enteredNewEmail !== user.email) newBody.email = enteredNewEmail;
                if (editedUserType !== user.userType) newBody.userType = editedUserType;
                if (editedName !== user.name) newBody.name = editedName;
                if (editedUserInfo !== userInfo) newBody.userInfo = Object.fromEntries(editedUserInfo);
                if (enteredNewPassword !== '') newBody.password = enteredNewPassword;
                await axios.put(`${API_URL}/user?id=${user._id}`, newBody);
    
                setIsLoading(false);
                return logout();

            } catch (err) {
                setIsLoading(false);
                return setFormError(err);
            }
        } catch (err) {
            setFormError(err);
            return setIsLoading(false);
        }
    }

    return (
        <div className="dashboard">
            <div className="dashboardContainer">
                <div className="dashboardHeaderContainer">
                    <h2>Manage Your Account</h2>
                </div>
                <div className="dashboardBodyContainer">
                    <div className="dashboardColumn">
                        <div className="dashboardTitle">Your details</div>
                        <div className="dashboardComponent">
                            <div className="accountInfo">Username: {user.username}</div>
                            <div className="accountInfo">Email address: {user.email}</div>
                            <div className="accountInfo">Name: {user.name}</div>
                            {userInfo && userInfo.map((info, i) => (
                                <div className="accountInfo" key={i}>{info[0]}: {info[1]}</div>
                            ))}
                        </div>
                    </div>
                    <div className="dashboardColumn">
                        <div className="dashboardComponent">
                            <form onSubmit={e => handleSubmit(e)}>
                                <div className="formTitle">Edit your details</div>
                                <fieldset>
                                    <legend>Personal Info</legend>

                                    <label htmlFor="name">Name</label>
                                    <input type="text" autoComplete="name" name="name" placeholder="e.g. Joe Bloggs" value={editedName} onChange={e => setEditedName(e.target.value)} />

                                </fieldset>
                                {userInfo &&
                                    <fieldset>
                                        <legend>Employee Info</legend>
                                        {userInfo.map((info, i) => (
                                            <div key={i}>
                                                <label htmlFor={info[0]}>{info[0]}</label>
                                                <input type={typeof info[1]} autoComplete="off" name={info[0]} placeholder={userInfo[i][1]} onChange={e => {
                                                    let newInfo = editedUserInfo;
                                                    newInfo[i][1] = e.target.value;
                                                    setEditedUserInfo(newInfo);
                                                }} />
                                            </div>
                                        ))}
                                    </fieldset>
                                }
                                <fieldset>
                                    <legend>Account Info</legend>

                                    <label htmlFor="userType">Account Type</label>
                                    {user.userType === 'MANAGER' ? 
                                        <input type="text" autoComplete="off" name="userType" placeholder="e.g. Driver" value={editedUserType} onChange={e => setEditedUserType(e.target.value)} />
                                    :
                                        <input type="text" autoComplete="off" name="userType" placeholder={user.userType} disabled title="Contact your manager to change this" />
                                    }

                                    <label htmlFor="username">Username</label>
                                    <input type="username" autoComplete="username" name="username" placeholder="e.g. joe.bloggs" value={editedUsername} onChange={e => setEditedUsername(e.target.value)} />

                                    <label htmlFor="email">Email address</label>
                                    <input type="email" autoComplete="email" name="email" placeholder="e.g. joe.bloggs@email.com" value={enteredNewEmail} onChange={e => setEnteredNewEmail(e.target.value)} />

                                    {(enteredNewEmail.length !== user.email.length || enteredNewEmail === reEnteredNewEmail) && 
                                        <>
                                            <label htmlFor="reEnteredNewEmail">Re-enter changed email address</label>
                                            <input type="email" autoComplete="email" name="email" placeholder="e.g. joe.bloggs@email.com" value={reEnteredNewEmail} onChange={e => setReEnteredNewEmail(e.target.value)} />
                                        </>
                                    }

                                    <label htmlFor="enteredNewPassword">New password</label>
                                    <input type="password" autoComplete="new-password" name="enteredNewPassword" placeholder="New password" value={enteredNewPassword} onChange={e => setEnteredNewPassword(e.target.value)} />

                                    {enteredNewPassword.length > 0 &&
                                        <>
                                            <label htmlFor="reEnteredNewPassword">Re-enter new password</label>
                                            <input required type="password" autoComplete="new-password" name="reEnteredNewPassword" placeholder="New password" value={reEnteredNewPassword} onChange={e => setReEnteredNewPassword(e.target.value)} />
                                        </>
                                    }
                                    
                                    <label htmlFor="currentPassword">Current password</label>
                                    <input required type="password" autoComplete="current-password" name="currentPassword" placeholder="Password" value={enteredPassword} onChange={e => setEnteredPassword(e.target.value)} />
                                </fieldset>
                                {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button type="submit">Save</button>}
                                {formError && <div className="formError">{formError.response.data.message}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Account;