import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PropTypes } from "prop-types";
import { LocalShipping } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const DriverCard = (props) => {

    const API_URL = import.meta.env.VITE_API_URL;

    const { id, username, name, userInfo } = props;

    const [isLoading, setIsLoading] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedUsername, setEditedUsername] = useState(username);
    const [editedMaxCarryWeight, setEditedMaxCarryWeight] = useState(userInfo.maxCarryWeight);
    const [availableDeliveries, setAvailableDeliveries] = useState([]);
    const [assignedDeliveries, setAssignedDeliveries] = useState([]);
    const [currentlyCarrying, setCurrentlyCarrying] = useState(0);
    const [capacity, setCapacity] = useState(0);
    const [selectedDeliveryId, setSelectedDeliveryId] = useState('');

    useEffect(() => {
        setIsLoading(true);
        const getMyDeliveries = async () => {
            try {
                const res = await axios.get(`${API_URL}/delivery?assignedDriverId=${id}`);
                setAssignedDeliveries([...res.data]);
                return setIsLoading(false);
            } catch (err) {
                return console.log(err);
            }
        }
        getMyDeliveries();
    }, []);

    useEffect(() => {
        if (assignedDeliveries.length === 0) return;
        let newWeight = 0;
        for (let i = 0; i < assignedDeliveries.length; i++) {
            newWeight += assignedDeliveries[i].weight;
        }
        return setCurrentlyCarrying(newWeight);
    }, [assignedDeliveries]);

    useEffect(() => {
        setCapacity(parseInt(currentlyCarrying / userInfo.maxCarryWeight * 100));
    }, [currentlyCarrying]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const editedUserInfo = { maxCarryWeight: editedMaxCarryWeight, assignedDeliveries: assignedDeliveries };

        try {
            await axios.put(`${API_URL}/user?id=${id}`, {
                username: editedUsername,
                name: editedName,
                userInfo: editedUserInfo,
            });
            setIsLoading(false);
            props.setDataChange('ALL');
            return setIsEditing(false);
        } catch (err) {
            return console.log(err);
        }
    }

    const deliveriesButtonClick = async () => {
        setIsAssigning(!isAssigning);
        setIsEditing(false);

        try {
            const res = await axios.get(`${API_URL}/delivery?available=true`);
            setAvailableDeliveries(res.data);
            return;
        } catch (err) {
            return console.log(err);
        }
    }

    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.put(`${API_URL}/delivery?id=${selectedDeliveryId}`, { assignedDriverId: id });
            setIsLoading(false);
            return props.setDataChange('ALL');
        } catch (err) {
            return console.log(err);
        }
    }

    const editButtonClick = () => {
        setIsEditing(!isEditing);
        setIsAssigning(false);
    }

    const deleteButtonClick = async () => {
        try {
            await axios.delete(`${API_URL}/user?id=${id}`);
            props.setDataChange('ALL');
            return;
        } catch (err) {
            return console.log(err);
        }
    }

    return (
        <div className="card">
            <div className="cardHeader">
                <div className="cardTitle">{name} (Driver {id.slice(-6)})</div>
                <div className="managerButtons">
                    <button className="editButton" title="Manage this driver's deliveries" onClick={() => deliveriesButtonClick()}><LocalShipping /></button>
                    <button className="editButton" title="Edit this driver" onClick={() => editButtonClick()}><EditIcon /></button>
                    <button className="deleteButton" title="Delete this driver" onClick={() => deleteButtonClick()}><DeleteIcon /></button>
                </div>
            </div>
            {isEditing ? 
                <>
                    <form onSubmit={e => handleEditSubmit(e)}>
                        <div className="formTitle">Edit Driver</div>
                        <fieldset>
                            <label htmlFor="name">Name</label>
                            <input required name="name" type="text" autoComplete='name' value={editedName} onChange={e => setEditedName(e.target.value)} placeholder="e.g. Joe Bloggs"></input>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="username">Username</label>
                            <input required name="username" type="username" autoComplete='username' value={editedUsername} onChange={e => setEditedUsername(e.target.value)} placeholder="e.g. joe.bloggs"></input>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="maxCarryWeight">Max. carry weight / kg</label>
                            <input required name="maxCarryWeight" type="number" autoComplete='off' value={editedMaxCarryWeight} onChange={e => setEditedMaxCarryWeight(e.target.value)} placeholder="1500"></input>
                        </fieldset>

                        {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button type="submit">Save changes</button>}
                    </form>
                </>
                :
                <>
                    <div className="cardInfo">Username: {username}</div>
                    {userInfo && <div className="cardInfo">Max. carry weight: {userInfo.maxCarryWeight}kg</div>}
                    {isLoading ?
                        <div className="cardInfo"><div className="loadingSpinner"><CircularProgress /> </div>Loading {name.split(" ")[0]}&apos;s deliveries...</div>
                        :
                        <>
                            {isAssigning ?
                                <form onSubmit={e => handleAssignSubmit(e)}>
                                    <div className="formTitle">Assign delivery</div>
                                    <fieldset>
                                        <select required autoComplete='off' onChange={e => setSelectedDeliveryId(e.target.value)} defaultValue='Default'>
                                            <option disabled hidden value='Default'>Select delivery</option>
                                            {availableDeliveries.map(delivery => (
                                                <option key={delivery._id} value={delivery._id}>Delivery {delivery._id.slice(-6)} ({delivery.location})</option>
                                            ))}
                                        </select>
                                    </fieldset>
                                    <button type="submit">Assign</button>
                                </form>
                            :
                            <div className="cardInfo">Assigned deliveries: {assignedDeliveries.length > 0 ? assignedDeliveries.length : 'None'}</div>
                            }
                            {assignedDeliveries.length > 0 && 
                                <>
                                    <div className="cardInfo">Currently carrying: {currentlyCarrying}kg ({capacity <= 100 ? `${capacity}% capacity` : <div className='capacityWarning'>{currentlyCarrying - userInfo.maxCarryWeight}kg over capacity!</div>})</div>
                                </>
                            }
                        </>
                    }
                </>    
            }
        </div>
    )
}

DriverCard.propTypes = {
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    name: PropTypes.string,
    userInfo: PropTypes.object.isRequired,
    setDataChange: PropTypes.func.isRequired,
}

export default DriverCard;