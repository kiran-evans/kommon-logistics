import ManagerPage from '../Manager/ManagerPage';
import DriverPage from '../Driver/DriverPage';

const Dashboard = (props) => {

    const user = props.currentUser;

    return (
        <div className="dashboard">
            {user.userType.toUpperCase() === 'MANAGER' ? <ManagerPage currentUser={user} /> : <DriverPage currentUser={user} />}
        </div>
    )
}

export default Dashboard;