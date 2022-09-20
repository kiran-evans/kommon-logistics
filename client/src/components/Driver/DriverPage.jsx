import DeliveryCard from "../Delivery/DeliveryCard";

const DriverPage = (props) => {

    const driver = props.currentUser;

    // console.log(driver);

    return (
        <div className="driverPage">
        <h1>Driver Dashboard</h1>
        <h2>{driver.name}'s Dashboard | Driver {parseInt(driver._id.slice(-3), 16)}</h2>
            
            <div className="driverMainContainer">
        
                <div className="dashboardComponent">
                    <h3>Deliveries</h3>

                    {driver.assignedDeliveries > 0 ? driver.assignedDeliveries.map(delivery => (
                        <DeliveryCard key={delivery._id} id={delivery._id} location={delivery.location} weight={delivery.weight} assignedDriverId={delivery.assignedDriverId} isDelivered={delivery.isDelivered} />
                    )) : <p>No assigned deliveries</p>}

                </div>

            </div>
        </div>
    )
}

export default DriverPage;