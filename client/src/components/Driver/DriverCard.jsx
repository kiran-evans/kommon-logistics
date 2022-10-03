import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PropTypes } from "prop-types";

const DriverCard = (props) => {

    const API_URL = import.meta.env.VITE_API_URL;

    const { id, username, name, userInfo } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedUsername, setEditedUsername] = useState(username);
    const [editedMaxCarryWeight, setEditedMaxCarryWeight] = useState(userInfo.maxCarryWeight);
    const [assignedDeliveries, setAssignedDeliveries] = useState([]);
    const [currentlyCarrying, setCurrentlyCarrying] = useState(0);

    useEffect(() => {
        const getMyDeliveries = async () => {
            try {
                const res = await axios.get(`${API_URL}/delivery?assignedDriverId=${id}`);
                return setAssignedDeliveries([...res.data]);
            } catch (err) {
                return console.log(err);
            }
        }
        getMyDeliveries();
    }, []);

    useEffect(() => {
        const getCurrentlyCarrying = () => {
            if (assignedDeliveries.length === 0) return;
            let newWeight = 0;
            for (let i = 0; i < assignedDeliveries.length; i++) {
                newWeight += assignedDeliveries[i].weight;
            }
            return setCurrentlyCarrying(newWeight);
        }
        getCurrentlyCarrying();
    }, [assignedDeliveries]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const editedUserInfo = { maxCarryWeight: editedMaxCarryWeight, assignedDeliveries: assignedDeliveries };

        try {
            await axios.put(`${API_URL}/user?id=${id}`, {
                username: editedUsername,
                name: editedName,
                userInfo: editedUserInfo,
            });

            props.setDataChange(true);
            return setIsEditing(false);
        } catch (err) {
            return console.log(err);
        }
    }

    const deleteButtonClick = async () => {
        try {
            await axios.delete(`${API_URL}/api/user?id=${id}`)
            return props.setDataChange(true);
        } catch (err) {
            return console.log(err);
        }
    }

    return (
        <div className="driverCard">
            <div className="managerButtons">
                <button className="editButton" title="Edit this driver" onClick={() => setIsEditing(!isEditing)}><EditIcon /></button>
                <button className="deleteButton" title="Delete this driver" onClick={() => deleteButtonClick()}><DeleteIcon /></button>
            </div>
            {isEditing ? 
                <>
                    <form className="userForm" onSubmit={e => handleEditSubmit(e)}>
                        <label htmlFor="name">Name</label>
                        <input required name="name" type="text" value={editedName} onChange={e => setEditedName(e.target.value)} placeholder="e.g. Joe Bloggs"></input>

                        <label htmlFor="username">Username</label>
                        <input required name="username" type="username" value={editedUsername} onChange={e => setEditedUsername(e.target.value)} placeholder="e.g. joe.bloggs"></input>

                        <label htmlFor="maxCarryWeight">Max. carry weight / kg</label>
                        <input required name="maxCarryWeight" type="number" value={editedMaxCarryWeight} onChange={e => setEditedMaxCarryWeight(e.target.value)} placeholder="1500"></input>

                        <button type="submit">Save changes</button>
                    </form>
                </>
                :
                <>
                    <h1>{name} (Driver number {parseInt(id.slice(-3).toUpperCase(), 16)})</h1>
                    <h2>Username: {username}</h2>
                    {userInfo && <h3>Max. carry weight: {userInfo.maxCarryWeight}kg</h3>}
                    <h3>Assigned deliveries: {assignedDeliveries.length > 0 ? assignedDeliveries.length : 'None'}</h3>
                    {assignedDeliveries.length > 0 && 
                        <>
                            <h3>Currently carrying: {currentlyCarrying}kg ({parseInt(currentlyCarrying/userInfo.maxCarryWeight*100)}% capacity)</h3>
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
    setDataChange: PropTypes.func.isRequired
}

export default DriverCard;