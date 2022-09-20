import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const DriverCard = (props) => {

    const { id, username, name, maxCarryWeight, assignedDeliveries } = props;

    return (
        <div className="driverCard">
            {props.isManager &&
                <div className="managerButtons">
                    <button className="editButton" title="Edit this driver"><EditIcon /></button>
                    <button className="deleteButton" title="Delete this driver"><DeleteIcon /></button>
                </div>
            }
            <h1>{name}</h1>
            <h2>Username: {username}</h2>
            <h2>Driver number: {parseInt(id.slice(-3).toUpperCase(), 16)}</h2>
            <h3>Max. carry weight: {maxCarryWeight}kg</h3>
            {assignedDeliveries.length === 0 ? <h3>No assigned deliveries</h3> : <h3>Already assigned deliveries</h3>}
        </div>
    )
}

export default DriverCard;