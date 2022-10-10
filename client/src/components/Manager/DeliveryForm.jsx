import axios from "axios";
import { useState } from "react";
import { CircularProgress } from '@mui/material'
import { PropTypes } from "prop-types";
import { services } from '@tomtom-international/web-sdk-services';
import { useEffect } from "react";
import { Edit } from "@mui/icons-material";

const DeliveryForm = (props) => {
    const API_URL = import.meta.env.KL_API_URL;
    const TT_API_KEY = import.meta.env.KL_TOM_TOM_API_KEY;

    const [addressQuery, setAddressQuery] = useState('');
    const [results, setResults] = useState('');
    const [weight, setWeight] = useState('');
    const [assignedDriverId, setAssignedDriverId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [addressSelected, setAddressSelected] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.post(`${API_URL}/delivery`, {
                location: addressQuery,
                weight: weight,
                assignedDriverId: assignedDriverId,
                dateAdded: Date.now()
            });

            props.setDataChange('DELIVERY');
            setResults([]);
            setAddressQuery('');
            setAddressSelected(false);
            setWeight('');
            return setIsLoading(false);

        } catch (err) {
            return console.log(err);
        }
    }

    const getAddresses = async () => {
        const geocodes = await services.geocode({
            countrySet: 'GB',
            key: TT_API_KEY,
            query: addressQuery
        });
        setResults(geocodes);
    }

    useEffect(() => {
        if (addressQuery.length > 3) {
            (addressSelected) ? setResults(null) : getAddresses();
        }
    }, [addressQuery]);

    return (
        <div className="deliveryForm">
            <form onSubmit={e => handleSubmit(e)}>
            <div className="formTitle">Create New Delivery</div>
                <fieldset>
                    <label htmlFor="addressQuery">Destination Address</label>
                    <div className="managerButtons">
                        <input disabled={addressSelected} required type="text" autoComplete="address" name="addressQuery" placeholder="e.g. 221b Baker Street, London" value={addressQuery} onChange={e => setAddressQuery(e.target.value)} />
                        {addressSelected && <button className="editButton" title="Edit this address" onClick={() => setAddressSelected(false)}><Edit /></button>}
                    </div>
                    {(results && results.summary.numResults > 0 && !addressSelected) &&
                        <select onChange={e => { setAddressQuery(e.target.value); setAddressSelected(true); }} defaultValue='Default'>
                            <option disabled hidden value='Default'>Select address ({results.summary.numResults} results)</option>
                            {results.results.map((r, i) => (
                                <option key={i} value={r.address.freeformAddress}>{r.address.freeformAddress}</option>
                            ))}
                        </select>
                    }
                </fieldset>

                <fieldset>
                    <label htmlFor="weight">Weight / kg</label>
                    <input required type="number" autoComplete="off" min={10} max={2000} name="weight" placeholder="e.g. 150" value={weight} onChange={e => setWeight(e.target.value)} />
                </fieldset>

                <fieldset>
                    <label htmlFor="driver">Assign Driver (optional)</label>
                    <select required onChange={e => setAssignedDriverId(e.target.value)} defaultValue={null}>
                            <option value={null}>None</option>
                            {props.drivers.map(d => (
                                <option key={d._id} value={d._id}>{d.name} ({d.username})</option>
                            ))}
                    </select>
                </fieldset>

                {isLoading ? <div className="loadingSpinner"><CircularProgress /></div> : <button type="submit">Create delivery</button>}
            </form>
        </div>
    )
}

DeliveryForm.propTypes = {
    drivers: PropTypes.array.isRequired,
    setDataChange: PropTypes.func.isRequired
}

export default DeliveryForm;