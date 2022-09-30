import ManagerPage from '../manager/ManagerPage';
import DriverPage from '../driver/DriverPage';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { logoutCall } from '../../context/APICalls';

const Dashboard = () => {

    const { user } = useContext(AuthContext);

    return (
        <div className="dashboard">
            {user.userType.toUpperCase() === 'MANAGER' ? <ManagerPage currentUser={user} /> : <DriverPage currentUser={user} />}
        </div>
    )
}

export default Dashboard;