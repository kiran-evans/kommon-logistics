import { PropTypes } from "prop-types";
import { useContext, useState } from "react";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";

const DeliveryCard = (props) => {
    const { id, location, assignedDriverId, isDelivered, weight, dateAdded } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editedIsDelivered, setEditedIsDelivered] = useState(isDelivered);
    const [editedLocation, setEditedLocation] = useState(location);
    const [editedWeight, setEditedWeight] = useState(weight);

    const { user } = useContext(AuthContext);

    const editButtonClick = () => {
        setIsEditing(!isEditing);
    }

    const deleteButtonClick = async () => {
        try {
            return props.setDeliveryChange(await axios.delete(`http://localhost:5000/api/delivery?id=${id}`));
        } catch (err) {
            return console.log(err);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await axios.put(`http://localhost:5000/api/delivery?id=${id}`, {
                location: editedLocation,
                weight: editedWeight,
                isDelivered: editedIsDelivered,
            });
            setIsEditing(false);
            setIsLoading(false);
            return props.setDeliveryChange(res);
        } catch (err) {
            return console.log(err);
        }
    }

    return (
        <div className="deliveryCard">
            {user.userType === 'MANAGER' &&
                <div className="managerButtons">
                    <button className="editButton" title="Edit this delivery" onClick={() => editButtonClick()}><EditIcon /></button>
                    <button className="deleteButton" title="Delete this delivery" onClick={() => deleteButtonClick()}><DeleteIcon /></button>
                </div>
            }
            <h1>Delivery {parseInt(id.slice(-3).toUpperCase(), 16)}</h1>
            <h2>Added: {new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' }).format(Date.parse(dateAdded))}</h2>
            {isEditing ? 
                <>
                    <form className="deliveryForm" onSubmit={e => handleSubmit(e)}>
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
                    <h3>Assigned Driver: {assignedDriverId}</h3>
                    <h3>Delivery status: {isDelivered ? 'Delivered' : 'Not delivered'}</h3>
                </>
            }
        </div>
    )
}

DeliveryCard.propTypes = {
    location: PropTypes.string.isRequired,
    assignedDriverId: PropTypes.string.isRequired,
    isDelivered: PropTypes.bool.isRequired,
    weight: PropTypes.number.isRequired,
}

export default DeliveryCard;