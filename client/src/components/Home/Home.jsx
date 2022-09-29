import Login from "./Login";

const Home = (props) => {
    return (
        <div className="home">
            <Login setCurrentUser={props.setCurrentUser} />
        </div>
    )
}

export default Home;