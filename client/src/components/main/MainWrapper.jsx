import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Dashboard from '../dashboard/Dashboard';
import Header from '../header/Header';
import NotFound from '../notfound/NotFound';
import Register from '../register/Register';
import Login from '../login/Login';
import Account from '../account/Account';
import PasswordReset from '../password-reset/PasswordReset';

const MainWrapper = () => {
    const { user } = useContext(AuthContext);

    return (
        <BrowserRouter>
            <div className="App">
                <Header />
                <div className='mainContainer'>
                    <Routes>
                        <Route exact path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
                        <Route exact path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
                        <Route exact path="/account" element={user ? <Account /> : <Register />} />
                        <Route exact path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
                        <Route exact path="/password-reset" element={user ? <Navigate to="/dashboard" /> : <PasswordReset />} />
                        <Route path="/*" element={user ? <NotFound /> : <Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default MainWrapper;