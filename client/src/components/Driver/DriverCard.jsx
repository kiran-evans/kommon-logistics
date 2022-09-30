import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useState } from 'react';

const DriverCard = (props) => {

    const { id, username, name, userInfo, assignedDeliveries } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedUsername, setEditedUsername] = useState(username);
    const [editedMaxCarryWeight, setEditedMaxCarryWeight] = useState(userInfo.maxCarryWeight);

    const editButtonClick = () => {
        setIsEditing(!isEditing);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const editedUserInfo = { maxCarryWeight: editedMaxCarryWeight, assignedDeliveries: assignedDeliveries };

        try {
            const res = await axios.put(`http://localhost:5000/api/user?id=${id}`, {
                username: editedUsername,
                name: editedName,
                userInfo: editedUserInfo,
            });

            props.setDriverChange(res);
            setIsEditing(false);
        } catch (err) {
            console.log(err);
        }
    }

    const deleteButtonClick = async () => {
        try {
            props.setDriverChange(await axios.delete(`http://localhost:5000/api/user?id=${id}`));
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="driverCard">
            <div className="managerButtons">
                <button className="editButton" title="Edit this driver" onClick={() => editButtonClick()}><EditIcon /></button>
                <button className="deleteButton" title="Delete this driver" onClick={() => deleteButtonClick()}><DeleteIcon /></button>
            </div>
            {isEditing ? 
                <>
                    <form className="userForm" onSubmit={e => handleSubmit(e)}>
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
                <h1>{name}</h1>
                <h2>Username: {username}</h2>
                <h2>Driver number: {parseInt(id.slice(-3).toUpperCase(), 16)}</h2>
                {userInfo && 
                    <>
                        <h3>Max. carry weight: {userInfo.maxCarryWeight}kg</h3>
                        {userInfo.assignedDeliveries.length === 0 ? <h3>No assigned deliveries</h3> : <h3>Already assigned deliveries</h3>}
                    </>
                }
                </>
            }
        </div>
    )
}

export default DriverCard;