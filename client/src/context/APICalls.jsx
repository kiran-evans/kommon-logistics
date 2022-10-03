import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

export const loginCall = async (userCredentials, dispatch) => {

    dispatch({ type: 'LOGIN_START' });

    try {
        const res = await axios.post(`${API_URL}/user/login`, userCredentials);
        dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });

    } catch (err) {
        dispatch({ type: 'LOGIN_FAILURE', payload: err });
        return console.log(err);
    }
}

export const logoutCall = async (user, dispatch) => {

    dispatch({ type: 'LOGOUT_START', payload: user });

    try {
        dispatch({ type: 'LOGOUT_SUCCESS' });

    } catch (err) {
        dispatch({ type: 'LOGOUT_FAILURE', payload: err });
        return console.log(err);
    }
}