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
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/user?id=${assignedDriverId}`);
            setMyDriver(res.data);
            return setIsLoading(false);
        } catch (err) {
            setMyDriver(null);
            setIsLoading(false)
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

            props.setDataChange('ALL');
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
            props.setDataChange('ALL');
            return;
        } catch (err) {
            return console.log(err);
        }
    }

    const assignButtonClick = () => {
        setIsAssigning(!isAssigning);
        setIsEditing(false);
    }

    const editButtonClick = () => {
        setIsEditing(!isEditing);
        setIsAssigning(false);
    }

    const deleteButtonClick = async () => {
        try {
            await axios.delete(`${API_URL}/delivery?id=${id}`)
            props.setDataChange('ALL');
            return;
        } catch (err) {
            return console.log(err);
        }
    }

    const deliveredButtonClick = async () => {
        setIsLoading(true);

        try {
            await axios.put(`${API_URL}/delivery?id=${id}`, {
                isDelivered: true,
                assignedDriverId: null
            });
            setIsLoading(false);
            props.setDataChange('ALL');
            return;
        } catch (err) {
            return console.log(err);
        }
    }

    return (
        <div className="card">
            <div className="cardHeader">
                <div className="cardTitle">Delivery {id.slice(-6)}</div>
                {user.userType === 'MANAGER' &&
                    <div className="managerButtons">
                        <button className={assignedDriverId ? 'editButton' : 'addButton'} title={assignedDriverId ? 'Change assigned driver for this delivery' : 'Assign driver to this delivery'} onClick={() => assignButtonClick()}>{assignedDriverId ? <Person /> : <PersonAdd />}</button>
                        <button className="editButton" title="Edit this delivery" onClick={() => editButtonClick()}><Edit /></button>
                        <button className="deleteButton" title="Delete this delivery" onClick={() => deleteButtonClick()}><Delete /></button>
                    </div>
                }
            </div>
            <div className="cardInfo">Added: {new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' }).format(Date.parse(dateAdded))}</div>
            {isEditing ? 
                <>
                    <form onSubmit={e => handleEditSubmit(e)}>
                        <div className="formTitle">Edit Delivery</div>
                        <fieldset>
                            <label htmlFor="location">Location</label>
                            <input required name="location" type="text" autoComplete="address" value={editedLocation} onChange={e => setEditedLocation(e.target.value)} placeholder="e.g. 221b Baker Street, London" />
                        </fieldset>

                        <fieldset>
                            <label htmlFor="weight">Weight / kg</label>
                            <input required name="weight" type="number" autoComplete="off" value={editedWeight} onChange={e => setEditedWeight(e.target.value)} placeholder="e.g. 1500" />
                        </fieldset>

                        <fieldset className="checkbox">
                            <label htmlFor="isDelivered">Delivered</label>
                            <input name="isDelivered" type="checkbox" autoComplete="off" checked={editedIsDelivered} value={!editedIsDelivered} onChange={e => setEditedIsDelivered(e.target.value)} />
                        </fieldset>

                        {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button type="submit">Save changes</button>}
                    </form>
                </>
                :
                <>
                    <div className="cardInfo">Location: {location}</div>
                    <div className="cardInfo">Weight: {weight}kg</div>
                    {isAssigning ?
                        <>
                            <form onSubmit={e => handleDriverAssignSubmit(e)}>
                                <div className="formTitle">Assign Driver</div>
                                <fieldset>
                                    <select required autoComplete="off" onChange={e => setSelectedDriverId(e.target.value)} defaultValue={assignedDriverId ? assignedDriverId : 'Default'}>
                                        <option disabled hidden value='Default'>Select driver</option>
                                        {drivers.map(driver => (
                                            <option key={driver._id} value={driver._id}>{driver.name} (Driver number {parseInt(driver._id.slice(-3).toUpperCase(), 16)})</option>
                                        ))}
                                    </select>
                                </fieldset>
                                {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button type="submit">Assign driver</button>}
                            </form>
                        </>
                        :
                        <>
                            {myDriver ? (
                                isLoading ? <div className="cardInfo"><div className="loadingSpinner"><CircularProgress /></div> Loading assigned driver...</div> : <div className="cardInfo">Assigned driver: {`${myDriver.name} (Driver ${myDriver._id.slice(-6)})`}</div>
                            ) : user.userType === 'MANAGER' && <div className="cardInfo">Assigned driver: None</div>
                            }
                            <div className="cardInfo">Delivery status: {isDelivered ? 'Delivered' : 'Not delivered'}</div>
                            {user.userType === 'DRIVER' && (
                                isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button onClick={() => deliveredButtonClick()}>Mark as delivered</button>
                            )}
                        </>
                    }
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