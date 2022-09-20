import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const DeliveryCard = (props) => {
    const { id, location, assignedDriverId, isDelivered, weight, dateAdded } = props;

    const navigator = useNavigate();
    const [deliveryStatus, setDeliveryStatus] = useState(isDelivered);
  
    // const goToDelivery = () => {
    //   props.setDelivery(props.delivery);
    //   navigator('/delivery');
    // }

    const deleteButtonClick = async () => {
        try {
            props.setDeliveryChange(await axios.delete(`http://localhost:5000/api/delivery/${id}`));
        } catch (err) {
            console.log(err);
        }
    }

    const deliveredButtonClick = async () => {
        try {
            await axios.put(`http://localhost:5000/api/delivery/${id}`, { isDelivered: true });
            setDeliveryStatus(true);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="deliveryCard">
            {props.isManager &&
                <div className="managerButtons">
                    <button className="editButton" title="Edit this delivery"><EditIcon /></button>
                    <button className="deleteButton" title="Delete this delivery" onClick={() => deleteButtonClick()}><DeleteIcon /></button>
                </div>
            }
            <h1>Delivery {parseInt(id.slice(-3).toUpperCase(), 16)}</h1>
            <h2>Added: {new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'short', year: 'numeric' }).format(Date.parse(dateAdded))}</h2>
            <h2>Location: {location}</h2>
            <h3>Weight: {weight}kg</h3>
            <h3>Assigned Driver: {assignedDriverId}</h3>
            <h3>Delivery status: {deliveryStatus ? 'Delivered' : 'Not delivered'}</h3>
            {!deliveryStatus && <button onClick={() => deliveredButtonClick()} >Mark as Delivered</button>}
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