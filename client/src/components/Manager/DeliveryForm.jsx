import axios from "axios";
import { useState } from "react";

const DeliveryForm = (props) => {

    const [location, setLocation] = useState('');
    const [weight, setWeight] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/api/delivery", {
                location: location,
                weight: weight,
                dateAdded: Date.now()
            });

            props.setDeliveryChange(res);
            setLocation('');
            setWeight('');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="deliveryForm">
            <h1>Create New Delivery</h1>
            <form onSubmit={e => handleSubmit(e)}>
                <label htmlFor="location">Location</label>
                <input type="text" name="location" placeholder="e.g. 221b Baker Street, London" value={location} onChange={e => setLocation(e.target.value)} />

                <label htmlFor="weight">Weight / kg</label>
                <input type="number" name="weight" placeholder="e.g. 150" value={weight} onChange={e => setWeight(e.target.value)} />

                <button type="submit">Create delivery</button>
            </form>
        </div>
    )
}

export default DeliveryForm;