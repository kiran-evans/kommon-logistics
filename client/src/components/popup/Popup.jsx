const Popup = (props) => {

    const errorMsg = props.errorMsg;

    return (
        <div className="apiError">
            <p><b>{errorMsg.code}</b></p>
            <p><b>{errorMsg.message}</b></p>
            <p>{errorMsg.response.data.message}</p>
        </div>
    )
}

export default Popup;