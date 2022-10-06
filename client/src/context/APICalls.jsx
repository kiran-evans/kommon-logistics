import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export const loginCall = async (userCredentials, dispatch) => {

    dispatch({ type: 'LOGIN_START' });

    try {
        const res = await axios.post(`${API_URL}/user/login`, userCredentials);
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
        return localStorage.setItem('user', JSON.stringify(res.data)); // Convert to string as localStorage cannot store objects

    } catch (err) {
        return dispatch({ type: 'LOGIN_FAILURE', payload: err });
    }
}

export const logoutCall = async (user, dispatch) => {

    dispatch({ type: 'LOGOUT_START', payload: user });

    try {
        dispatch({ type: 'LOGOUT_SUCCESS' });
        return localStorage.clear();

    } catch (err) {
        dispatch({ type: 'LOGOUT_FAILURE', payload: err });
        return console.log(err);
    }
}