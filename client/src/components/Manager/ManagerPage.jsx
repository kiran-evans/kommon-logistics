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
    const [deliveryChange, setDeliveryChange] = useState(false);
    const [driverChange, setDriverChange] = useState(false);

    useEffect(() => {
        const getDeliveries = async () => {
            setDeliveryChange(false);
            try {
                const res = await axios.get(`${API_URL}/delivery`);
                return setDeliveries(res.data);

            } catch (err) {
                return console.log(err);
            }
        }

        getDeliveries();
    }, [deliveryChange]);

    useEffect(() => {
        const getDrivers = async () => {
            setDriverChange(false);
            try {
                const res = await axios.get(`${API_URL}/user?userType=driver`);
                return setDrivers(res.data);

            } catch (err) {
                console.log(err);
            }
        }
        getDrivers();
    }, [driverChange]);

    // console.log(manager);

    return (
        <div className="managerPage">
            <h1>Manager Dashboard</h1>
            <h2>{user.name}'s Dashboard | Manager {parseInt(user._id.slice(-3), 16)}</h2>

            <div className="managerMainContainer">
                <div className="dashboardComponent">
                    <h3>Deliveries</h3>
                    {deliveries.map(delivery => (
                        <DeliveryCard key={delivery._id} id={delivery._id} location={delivery.location} weight={delivery.weight} assignedDriverId={delivery.assignedDriverId} isDelivered={delivery.isDelivered} dateAdded={delivery.dateAdded} setDeliveryChange={setDeliveryChange} />
                    ))}
                </div>
                <div className="dashboardComponent">
                    <h3>Drivers</h3>
                    {drivers.map(driver => (
                        <DriverCard key={driver._id} id={driver._id} username={driver.username} name={driver.name} userInfo={driver.userInfo} assignedDeliveries={driver.assignedDeliveries} setDriverChange={setDriverChange} />
                    ))}
                </div>
                <div className="dashboardComponent">
                    <h3>Manage</h3>
                    <DeliveryForm setDeliveryChange={setDeliveryChange} />
                    <UserForm setDriverChange={setDriverChange} />
                </div>
            </div>

        </div>
    )
}

export default ManagerPage;