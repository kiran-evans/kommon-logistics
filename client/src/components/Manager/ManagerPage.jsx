import axios from "axios";
import { useState, useEffect } from "react";
import DeliveryCard from "../Delivery/DeliveryCard";
import DriverCard from "../Driver/DriverCard";
import DeliveryForm from "./DeliveryForm";
import DriverForm from "./DriverForm";

const ManagerPage = (props) => {

    const manager = props.currentUser;

    const [drivers, setDrivers] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [deliveryChange, setDeliveryChange] = useState(false);
    const [driverChange, setDriverChange] = useState(false);

    useEffect(() => {
        const getDeliveries = async () => {
            setDeliveryChange(false);
            try {
                const res = await axios.get("http://localhost:5000/api/delivery");
                return setDeliveries(res.data);

            } catch (err) {
                console.log(err);
            }
        }

        getDeliveries();
    }, [deliveryChange]);

    useEffect(() => {
        const getDrivers = async () => {
            setDriverChange(false);
            try {
                const res = await axios.get("http://localhost:5000/api/driver");
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
            <h2>{manager.name}'s Dashboard | Manager {parseInt(manager._id.slice(-3), 16)}</h2>

            <div className="managerMainContainer">
                <div className="dashboardComponent">
                    <h3>Deliveries</h3>
                    {deliveries.map(delivery => (
                        <DeliveryCard key={delivery._id} id={delivery._id} location={delivery.location} weight={delivery.weight} assignedDriverId={delivery.assignedDriverId} isDelivered={delivery.isDelivered} dateAdded={delivery.dateAdded} isManager={manager.isManager} setDeliveryChange={setDeliveryChange} />
                    ))}
                </div>
                <div className="dashboardComponent">
                    <h3>Drivers</h3>
                    {drivers.map(driver => (
                        <DriverCard key={driver._id} id={driver._id} username={driver.username} name={driver.name} maxCarryWeight={driver.maxCarryWeight} assignedDeliveries={driver.assignedDeliveries} isManager={manager.isManager} setDriverChange={setDriverChange} />
                    ))}
                </div>
                <div className="dashboardComponent">
                    <h3>Manage</h3>
                    <DeliveryForm setDeliveryChange={setDeliveryChange} />
                    <DriverForm setDriverChange={setDriverChange} />
                </div>
            </div>

        </div>
    )
}

export default ManagerPage;