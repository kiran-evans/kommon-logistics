import { PropTypes } from "prop-types";
import { useContext, useState } from "react";
import axios from "axios";
import { Delete, Edit, Person, PersonAdd } from '@mui/icons-material';
import { CircularProgress } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";

const DeliveryCard = (props) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { id, location, assignedDriverId, isDelivered, weight, dateAdded } = props;
    const { user } = useContext(AuthContext);

    const [isAssigning, setIsAssigning] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editedIsDelivered, setEditedIsDelivered] = useState(isDelivered);
    const [editedLocation, setEditedLocation] = useState(location);
    const [editedWeight, setEditedWeight] = useState(weight);
    const [drivers, setDrivers] = useState([]);
    const [selectedDriverId, setSelectedDriverId] = useState('');
    const [myDriver, setMyDriver] = useState('');

    const getMyDriver = async () => {
        if (!assignedDriverId) return;
        try {
            const res = await axios.get(`${API_URL}/user?id=${assignedDriverId}`);
            return setMyDriver(res.data);
        } catch (err) {
            return console.log(err);
        }
    }

    useEffect(() => {
        getMyDriver();
    }, []);

    useEffect(() => {
        getMyDriver();
    }, [assignedDriverId]);

    useEffect(() => {
        const getAllDrivers = async () => {
            try {
                const res = await axios.get(`${API_URL}/user?userType=driver`);
                return setDrivers(res.data);
            } catch (err) {
                return console.log(err);
            }
        }
        getAllDrivers();
    }, [isAssigning]);

    const handleDriverAssignSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.put(`${API_URL}/delivery?id=${id}`, {
                assignedDriverId: selectedDriverId,
            });

            props.setDataChange(true);
            setIsAssigning(false);
            return setIsLoading(false);

        } catch (err) {
            return console.log(err);
        }
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.put(`${API_URL}/delivery?id=${id}`, {
                location: editedLocation,
                weight: editedWeight,
                isDelivered: editedIsDelivered,
            });
            setIsEditing(false);
            setIsLoading(false);
            return props.setDataChange(true);
        } catch (err) {
            return console.log(err);
        }
    }

    const deleteButtonClick = async () => {
        try {
            await axios.delete(`${API_URL}/delivery?id=${id}`)
            return props.setDataChange(true);
        } catch (err) {
            return console.log(err);
        }
    }

    return (
        <div className="deliveryCard">
            {user.userType === 'MANAGER' &&
                <div className="managerButtons">
                    <button className={assignedDriverId ? 'editButton' : 'addButton'} title={assignedDriverId ? 'Change assigned driver for this delivery' : 'Assign driver to this delivery'} onClick={() => setIsAssigning(!isAssigning)}>{assignedDriverId ? <Person /> : <PersonAdd />}</button>
                    <button className="editButton" title="Edit this delivery" onClick={() => setIsEditing(!isEditing)}><Edit /></button>
                    <button className="deleteButton" title="Delete this delivery" onClick={() => deleteButtonClick()}><Delete /></button>
                </div>
            }
            <h1>Delivery {id.slice(-6)}</h1>
            <h2>Added: {new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' }).format(Date.parse(dateAdded))}</h2>
            {isEditing ? 
                <>
                    <form className="deliveryForm" onSubmit={e => handleEditSubmit(e)}>
                        <label htmlFor="location">Location</label>
                        <input required name="location" type="text" value={editedLocation} onChange={e => setEditedLocation(e.target.value)} placeholder="e.g. 221b Baker Street, London" />

                        <label htmlFor="weight">Weight / kg</label>
                        <input required name="weight" type="number" value={editedWeight} onChange={e => setEditedWeight(e.target.value)} placeholder="e.g. 1500" />

                        <label htmlFor="isDelivered">Delivered</label>
                        <input name="isDelivered" type="checkbox" checked={editedIsDelivered} value={!editedIsDelivered} onChange={e => setEditedIsDelivered(e.target.value)} />

                        {isLoading ? <button type="button" disabled><CircularProgress /></button> : <button type="submit">Save changes</button>}
                    </form>
                </>
                :
                <>
                    <h2>Location: {location}</h2>
                    <h3>Weight: {weight}kg</h3>
                    {isAssigning ? <>
                        <form onSubmit={e => handleDriverAssignSubmit(e)}>
                            <select required onChange={e => setSelectedDriverId(e.target.value)} defaultValue='Default'>
                                <option disabled hidden value='Default'>Select driver</option>
                                {drivers.map(driver => (
                                    <option key={driver._id} value={driver._id}>{driver.name} (Driver number {parseInt(driver._id.slice(-3).toUpperCase(), 16)})</option>
                                ))}
                            </select>
                            {isLoading ? <button type="button" disabled><CircularProgress /></button> : <button type="submit">Assign driver</button>}
                        </form>
                        </>
                        :
                        <h3>{myDriver && `Assigned driver: ${myDriver.name} (Driver number ${parseInt(myDriver._id.slice(-3).toUpperCase(), 16)})`}</h3>}
                    <h3>Delivery status: {isDelivered ? 'Delivered' : 'Not delivered'}</h3>
                </>
            }
        </div>
    )
}

DeliveryCard.propTypes = {
    id: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    assignedDriverId: PropTypes.string,
    isDelivered: PropTypes.bool.isRequired,
    weight: PropTypes.number.isRequired,
    dateAdded: PropTypes.string.isRequired,
    setDataChange: PropTypes.func.isRequired
}

export default DeliveryCard;