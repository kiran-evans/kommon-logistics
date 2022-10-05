import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="notFound">
            <h1>404: Page not found</h1>
            <Link to="/"><button type="button">Back Home</button></Link>
        </div>
    )
}

export default NotFound;