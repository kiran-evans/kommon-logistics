import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { useState } from 'react';
import { PropTypes } from "prop-types";

const ManagerCard = (props) => {

    const API_URL = import.meta.env.VITE_API_URL;

    const { id, username, name } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(name);
    const [editedUsername, setEditedUsername] = useState(username);

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${API_URL}/user?id=${id}`, {
                username: editedUsername,
                name: editedName,
            });

            props.setDataChange(true);
            return setIsEditing(false);
        } catch (err) {
            return console.log(err);
        }
    }

    const editButtonClick = () => {
        setIsEditing(!isEditing);
    }

    const deleteButtonClick = async () => {
        try {
            await axios.delete(`${API_URL}/user?id=${id}`)
            return props.setDataChange(true);
        } catch (err) {
            return console.log(err);
        }
    }

    return (
        <div className="card">
            <div className="cardHeader">
                <div className="cardTitle">{name} (Manager {id.slice(-6)})</div>
                <div className="managerButtons">
                    <button className="editButton" title="Edit this manager" onClick={() => editButtonClick()}><EditIcon /></button>
                    <button className="deleteButton" title="Delete this manager" onClick={() => deleteButtonClick()}><DeleteIcon /></button>
                </div>
            </div>
            {isEditing ? 
                <>
                    <form onSubmit={e => handleEditSubmit(e)}>
                        <div className="formTitle">Edit Manager</div>
                        <fieldset>
                            <label htmlFor="name">Name</label>
                            <input required name="name" type="text" value={editedName} onChange={e => setEditedName(e.target.value)} placeholder="e.g. Joe Bloggs"></input>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="username">Username</label>
                            <input required name="username" type="username" value={editedUsername} onChange={e => setEditedUsername(e.target.value)} placeholder="e.g. joe.bloggs"></input>
                        </fieldset>

                        <button type="submit">Save changes</button>
                    </form>
                </>
                :
                <>
                    <div className="cardInfo">Username: {username}</div>
                </>    
            }
        </div>
    )
}

ManagerCard.propTypes = {
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    name: PropTypes.string,
    setDataChange: PropTypes.func.isRequired
}

export default ManagerCard;