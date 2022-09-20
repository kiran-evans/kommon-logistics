import axios from "axios";
import { useState } from "react";

const DriverForm = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [maxCarryWeight, setMaxCarryWeight] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/api/driver", {
                username: username,
                password: password,
                name: name,
                maxCarryWeight: maxCarryWeight
            });

            props.setDriverChange(res);
            setUsername('');
            setPassword('');
            setName('');
            setMaxCarryWeight('');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="driverForm">
            <h1>Create New Driver</h1>
            <form onSubmit={e => handleSubmit(e)}>
                <h2>Login details</h2>
                <label htmlFor="username">Username</label>
                <input type="username" name="username" placeholder="e.g. joe.bloggs" value={username} onChange={e => setUsername(e.target.value)} />

                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

                <h2>Personal details</h2>
                <label htmlFor="name">Name</label>
                <input type="text" name="name" placeholder="e.g. Joe Bloggs" value={name} onChange={e => setName(e.target.value)} />

                <label htmlFor="maxCarryWeight">Max. carry weight / kg</label>
                <input type="number" name="maxCarryWeight" placeholder="e.g. 1500" value={maxCarryWeight} onChange={e => setMaxCarryWeight(e.target.value)} />



                <button type="submit">Create driver</button>
            </form>
        </div>
    )
}

export default DriverForm;