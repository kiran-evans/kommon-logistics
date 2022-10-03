import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import DeliveryCard from "../delivery/DeliveryCard";
import DriverCard from "../driver/DriverCard";
import DeliveryForm from "./DeliveryForm";
import UserForm from "./UserForm";

const ManagerPage = () => {

    const API_URL = import.meta.env.VITE_API_URL;

    const { user } = useContext(AuthContext);

    const [drivers, setDrivers] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [dataChange, setDataChange] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setDeliveries([]);
            setDrivers([]);

            try {
                const res1 = await axios.get(`${API_URL}/delivery`);
                setDeliveries(res1.data);
                const res2 = await axios.get(`${API_URL}/user?userType=driver`);
                setDrivers(res2.data);
                return;
            } catch (err) {
                return console.log(err);
            }
        }

        getData();
        setDataChange(false);
    }, [dataChange]);

    // console.log(manager);

    return (
        <div className="managerPage">
            <h1>Manager Dashboard</h1>
            <h2>{user.name}&apos;s Dashboard | Manager {parseInt(user._id.slice(-3), 16)}</h2>

            <div className="managerMainContainer">
                <div className="dashboardComponent">
                    <h3>Deliveries</h3>
                    <div className="dashboardMap">
                        {deliveries.map(delivery => (
                            <DeliveryCard key={delivery._id} id={delivery._id} location={delivery.location} weight={delivery.weight} assignedDriverId={delivery.assignedDriverId} isDelivered={delivery.isDelivered} dateAdded={delivery.dateAdded} setDataChange={setDataChange} />
                        ))}
                    </div>
                </div>
                <div className="dashboardComponent">
                    <h3>Drivers</h3>
                    <div className="dashboardMap">
                        {drivers.map(driver => (
                            <DriverCard key={driver._id} id={driver._id} username={driver.username} name={driver.name} userInfo={driver.userInfo} setDataChange={setDataChange} />
                        ))}
                    </div>
                </div>
                <div className="dashboardComponent">
                    <h3>Manage</h3>
                    <DeliveryForm setDataChange={setDataChange} />
                    <UserForm setDataChange={setDataChange} />
                </div>
            </div>

        </div>
    )
}

export default ManagerPage;