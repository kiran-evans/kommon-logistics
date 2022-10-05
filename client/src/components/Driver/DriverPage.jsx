import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import DeliveryCard from "../delivery/DeliveryCard";
import MapPlotter from "./MapPlotter";

const DriverPage = () => {

    const { user } = useContext(AuthContext);
    const API_URL = import.meta.env.VITE_API_URL;

    const [dataChange, setDataChange] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [assignedDeliveries, setAssignedDeliveries] = useState([]);
    const [displayMapPlotter, setDisplayMapPlotter] = useState(false);

    const getMyDeliveries = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/delivery?assignedDriverId=${user._id}`);
            setAssignedDeliveries(res.data);
            setDisplayMapPlotter(true);
            return setIsLoading(false);
        } catch (err) {
            return console.log(err);
        }
    }

    useEffect(() => {
        getMyDeliveries();
    }, []);

    useEffect(() => {
        setDataChange(false);
        getMyDeliveries();
    }, [dataChange]);

    return (
        <div className="dashboardContainer">
            <div className="dashboardHeaderContainer">
                <h2>Driver Dashboard</h2>
            </div>
            {isLoading ?
                <div className="dashboardTitle">
                    <div className="loadingSpinner"><CircularProgress /> Loading {user.name.split(" ")[0]}&apos;s dashboard...</div>
                </div>
                :
                <div className="dashboardBodyContainer">
                    <div className="dashboardColumn">
                        <div className="dashboardTitle">Deliveries</div>

                        <div className="dashboardComponent">
                            {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : assignedDeliveries.length > 0 ? assignedDeliveries.map(delivery => (
                                <DeliveryCard key={delivery._id} id={delivery._id} location={delivery.location} weight={delivery.weight} isDelivered={delivery.isDelivered} dateAdded={delivery.dateAdded} setDataChange={setDataChange} />
                            )) : <p>No assigned deliveries</p>
                            }
                        </div>
                    </div>
                    <div className="dashboardColumn">
                        <div className="dashboardTitle">Map</div>
                        <div className="dashboardComponent">
                            {displayMapPlotter && <MapPlotter assignedDeliveries={assignedDeliveries} />}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default DriverPage;