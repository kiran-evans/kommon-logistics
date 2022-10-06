import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useContext } from "react";
import { useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import DeliveryCard from "../delivery/DeliveryCard";
import DriverCard from "../driver/DriverCard";
import DeliveryForm from "./DeliveryForm";
import ManagerCard from "./ManagerCard";
import UserForm from "./UserForm";

const ManagerPage = () => {

    const { user } = useContext(AuthContext);

    const API_URL = import.meta.env.VITE_API_URL;

    const [isLoading, setIsLoading] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [managers, setManagers] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [dataChange, setDataChange] = useState('ALL');

    const deliveryViews = ['Undelivered', 'Delivered'];
    const [deliveryView, setDeliveryView] = useState(deliveryViews[0]);
    const userViews = ['Drivers', 'Managers'];
    const [userView, setUserView] = useState(userViews[0]);

    const getDeliveries = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/delivery`);
            setDeliveries(res.data);
            setDataChange('NONE');
            return setIsLoading(false);
        } catch (err) {
            return console.log(err);
        }
    }

    const getDrivers = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/user?userType=driver`);
            setDrivers(res.data);
            setDataChange('NONE');
            return setIsLoading(false);
        } catch (err) {
            return console.log(err);
        }
    }

    const getManagers = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/user?userType=manager`);
            setManagers(res.data);
            setDataChange('NONE');
            return setIsLoading(false);
        } catch (err) {
            return console.log(err);
        }
    }

    const getData = async () => {
        switch (dataChange.toUpperCase()) {
            case 'NONE':
                return;
            case 'ALL':
                getDeliveries();
                getDrivers();
                return getManagers();
            case 'DELIVERY':
                setDeliveries([]);
                return getDeliveries();
            case 'DRIVER':
                setDrivers([]);
                return getDrivers();
            case 'MANAGER':
                setManagers([]);
                return getManagers();
            default:
                return setDataChange('NONE');
        }
    }

    useEffect(() => {
        getData();
        setDataChange('NONE');
    }, []);

    useEffect(() => {
        getData();
    }, [dataChange]);

    const renderDeliveryView = () => {
        switch (deliveryView) {
            case 'Undelivered':
                return (
                    <>
                        {deliveries.filter(d => !d.isDelivered).map(delivery => (
                            <DeliveryCard key={delivery._id} id={delivery._id} location={delivery.location} weight={delivery.weight} assignedDriverId={delivery.assignedDriverId} isDelivered={delivery.isDelivered} dateAdded={delivery.dateAdded} setDataChange={setDataChange} />
                        ))}
                    </>
                )
            case 'Delivered':
                return (
                    <>
                        {deliveries.filter(d => d.isDelivered).map(delivery => (
                            <DeliveryCard key={delivery._id} id={delivery._id} location={delivery.location} weight={delivery.weight} assignedDriverId={delivery.assignedDriverId} isDelivered={delivery.isDelivered} dateAdded={delivery.dateAdded} setDataChange={setDataChange} />
                        ))}
                    </>
                )
            default:
                return (
                    <div className="dashboardTitle">Select view</div>
                )
        }
    }
    
    const renderUserView = () => {
        switch (userView) {
            case 'Drivers':
                return (
                    <>
                        {drivers.map(driver => (
                            <DriverCard key={driver._id} id={driver._id} username={driver.username} name={driver.name} userInfo={driver.userInfo} setDataChange={setDataChange} />
                        ))}
                    </>
                )
            case 'Managers':
                return (
                    <>
                        {managers.map(manager => (
                            <ManagerCard key={manager._id} id={manager._id} username={manager.username} name={manager.name} setDataChange={setDataChange} />
                        ))}
                    </>
                )
            
            default:
                return (
                    <p>Select view</p>
                )
        }
    }

    return (
        <div className="dashboardContainer">
            <div className="dashboardHeaderContainer">
                <h2>Manager Dashboard</h2>
            </div>
            <div className="dashboardBodyContainer">
                {isLoading && dataChange === 'ALL' ?
                    <div className="dashboardColumn">
                        <div className="dashboardTitle">
                            <div className="loadingSpinner"><CircularProgress /> </div>
                            Loading {user.name.split(" ")[0]}&apos;s dashboard...
                        </div>
                    </div>
                    :
                    <>
                    <div className="dashboardColumn">
                        {dataChange === 'DELIVERY' ?
                            <div className="dashboardTitle">
                                <div className="loadingSpinner"><CircularProgress /> </div>
                                Loading deliveries...
                            </div>
                            :
                            <>
                                <div className="dashboardTitle">
                                    {deliveryView}
                                    <select onChange={e => setDeliveryView(e.target.value)} defaultValue="Default">
                                        <option disabled hidden value="Default">Change view</option>
                                        {deliveryViews.map(v => (
                                            <option key={v} value={v}>View {v}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="dashboardComponent">
                                        {renderDeliveryView()}
                                </div>
                            </>
                        }
                        
                    </div>
                    <div className="dashboardColumn">
                        {dataChange === 'DRIVER' || dataChange === 'MANAGER' ?
                            <div className="dashboardTitle">
                                <div className="loadingSpinner"><CircularProgress /> </div>
                                Loading {dataChange.toLowerCase()}s...
                            </div>
                            :
                            <>
                                <div className="dashboardTitle">
                                    {userView}
                                    <select onChange={e => setUserView(e.target.value)} defaultValue="Default">
                                        <option disabled hidden value="Default">Change view</option>
                                        {userViews.map(v => (
                                            <option key={v} value={v}>View {v}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="dashboardComponent">
                                    {renderUserView()}
                                </div>
                            </>
                        }
                    </div>
                    <div className="dashboardColumn">
                        <div className="dashboardTitle">Manage</div>
                        <div className="dashboardComponent">
                            <DeliveryForm setDataChange={setDataChange} />
                            <UserForm setDataChange={setDataChange} />
                        </div>
                    </div>
                    </>
                }
            </div>
        </div>
    )
}

export default ManagerPage;